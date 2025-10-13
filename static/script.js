document.addEventListener('DOMContentLoaded', () => {

    // --- Global Page Load Animation ---
    // Applies fade-in animation on page load
    const applyPerformanceSettings = () => {
        const animationsDisabled = localStorage.getItem('animationsDisabled') === 'true';
        document.body.classList.toggle('animations-disabled', animationsDisabled);
    };
    applyPerformanceSettings();
    document.body.classList.add('loaded');

    // --- Clock Page Logic ---
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const settingsIcon = document.getElementById('settings-icon');
        const settingsPanel = document.getElementById('settings-panel');
        const secondsToggle = document.getElementById('seconds-toggle');
        const fontSelect = document.getElementById('font-select');
        const animationsToggle = document.getElementById('animations-toggle');
        let clockInterval;

        const updateClock = () => {
            const showSeconds = secondsToggle.checked;
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            timeElement.textContent = showSeconds 
                ? `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`
                : `${hours}:${minutes}`;
        };

        const saveSettings = () => {
            localStorage.setItem('clockShowSeconds', secondsToggle.checked);
            localStorage.setItem('clockFont', fontSelect.value);
            localStorage.setItem('animationsDisabled', animationsToggle.checked);
        };

        const loadSettings = () => {
            secondsToggle.checked = localStorage.getItem('clockShowSeconds') === 'true';
            animationsToggle.checked = localStorage.getItem('animationsDisabled') === 'true';
            
            const savedFont = localStorage.getItem('clockFont') || 'font-segoe';
            fontSelect.value = savedFont;
            timeElement.className = 'time ' + savedFont;
            
            if (clockInterval) clearInterval(clockInterval);
            updateClock();
            clockInterval = setInterval(updateClock, 1000);
        };

        settingsIcon.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
        settingsPanel.addEventListener('click', (e) => {
            if (e.target === settingsPanel) settingsPanel.classList.add('hidden');
        });

        secondsToggle.addEventListener('change', () => { saveSettings(); updateClock(); });
        fontSelect.addEventListener('change', () => {
            timeElement.className = 'time ' + fontSelect.value;
            saveSettings();
        });
        animationsToggle.addEventListener('change', () => {
            saveSettings();
            applyPerformanceSettings();
        });

        loadSettings();
    }

    // --- Generic Server Toggle Logic (for FTP & SSH) ---
    const setupToggleButton = (onBtnId, offBtnId, endpoint) => {
        const onBtn = document.getElementById(onBtnId);
        const offBtn = document.getElementById(offBtnId);
        if (!onBtn || !offBtn) return;

        const toggleServer = async (action) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: action })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    window.location.reload(); // Simple reload to show status change
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Server connection error.');
            }
        };

        onBtn.addEventListener('click', () => toggleServer('stop'));
        offBtn.addEventListener('click', () => toggleServer('start'));
    };

    setupToggleButton('ftp-on-btn', 'ftp-off-btn', '/toggle_ftp');
    setupToggleButton('ssh-on-btn', 'ssh-off-btn', '/toggle_ssh');

    // --- Music Player Logic ---
    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer) {
        const audioPlayer = document.getElementById('audio-player');
        const playlistElement = document.getElementById('playlist');
        const trackTitle = document.getElementById('track-title');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        let songs = [];
        let currentSongIndex = 0;

        const loadSongs = async () => {
            const response = await fetch('/api/songs');
            songs = await response.json();
            renderPlaylist();
        };

        const renderPlaylist = () => {
            playlistElement.innerHTML = '';
            songs.forEach((song, index) => {
                const li = document.createElement('li');
                li.textContent = song.replace(/\.mp3/i, '');
                li.dataset.index = index;
                playlistElement.appendChild(li);
            });
        };
        
        const playSong = (index) => {
            if (index < 0 || index >= songs.length) return;
            currentSongIndex = index;
            audioPlayer.src = `/music_files/${songs[currentSongIndex]}`;
            trackTitle.textContent = songs[currentSongIndex].replace(/\.mp3/i, '');
            audioPlayer.play();
            playPauseBtn.textContent = '⏸️';

            document.querySelectorAll('#playlist li').forEach(li => li.classList.remove('active'));
            document.querySelector(`#playlist li[data-index='${index}']`).classList.add('active');
        };

        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.textContent = '⏸️';
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = '▶️';
            }
        });
        
        nextBtn.addEventListener('click', () => playSong((currentSongIndex + 1) % songs.length));
        prevBtn.addEventListener('click', () => playSong((currentSongIndex - 1 + songs.length) % songs.length));
        playlistElement.addEventListener('click', (e) => {
            if (e.target && e.target.nodeName === 'LI') {
                playSong(parseInt(e.target.dataset.index));
            }
        });

        loadSongs();
    }

    // --- Whiteboard Logic ---
    const canvas = document.getElementById('whiteboard-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('color-picker');
        const clearBtn = document.getElementById('clear-canvas-btn');
        let isDrawing = false;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const startDrawing = (e) => {
            isDrawing = true;
            draw(e);
        };
        const stopDrawing = () => isDrawing = false;
        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = colorPicker.value;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchmove', draw);

        clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    }
});
