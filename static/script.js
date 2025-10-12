document.addEventListener('DOMContentLoaded', () => {

    const applyPerformanceSettings = () => {
        const animationsDisabled = localStorage.getItem('clockAnimationsDisabled') === 'true';
        const optimizationEnabled = localStorage.getItem('clockOptimizationEnabled') === 'true';

        document.body.classList.remove('animations-disabled', 'absolute-optimization-enabled');

        if (optimizationEnabled) {
            document.body.classList.add('absolute-optimization-enabled');
        } else if (animationsDisabled) {
            document.body.classList.add('animations-disabled');
        }
    };
    applyPerformanceSettings();


    document.body.style.opacity = '1';

    const navigateBtn = document.getElementById('navigate-btn');
    if (navigateBtn) {
        navigateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = navigateBtn.dataset.target;
            
            if (document.body.classList.contains('animations-disabled') || document.body.classList.contains('absolute-optimization-enabled')) {
                window.location.href = targetUrl;
                return;
            }

            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        });
    }

    const timeElement = document.getElementById('time');
    if (timeElement) {
        const settingsIcon = document.getElementById('settings-icon');
        const settingsPanel = document.getElementById('settings-panel');
        const secondsToggle = document.getElementById('seconds-toggle');
        const fontSelect = document.getElementById('font-select');
        const animationsToggle = document.getElementById('animations-toggle');
        const absoluteOptimizationToggle = document.getElementById('absolute-optimization-toggle');
        let clockInterval;

        const updateClock = () => {
            const showSeconds = secondsToggle.checked;
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            if (showSeconds) {
                const seconds = String(now.getSeconds()).padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
                timeElement.style.fontSize = "20vw";
            } else {
                timeElement.textContent = `${hours}:${minutes}`;
                timeElement.style.fontSize = "";
            }
        };

        const saveSettings = () => {
            localStorage.setItem('clockShowSeconds', secondsToggle.checked);
            localStorage.setItem('clockFont', fontSelect.value);
            localStorage.setItem('clockAnimationsDisabled', animationsToggle.checked);
            localStorage.setItem('clockOptimizationEnabled', absoluteOptimizationToggle.checked);
        };

        const handleTogglesLogic = () => {
            if (absoluteOptimizationToggle.checked) {
                animationsToggle.checked = true;
                animationsToggle.disabled = true;
            } else {
                animationsToggle.disabled = false;
            }
        };

        const loadSettings = () => {
            secondsToggle.checked = localStorage.getItem('clockShowSeconds') === 'true';
            animationsToggle.checked = localStorage.getItem('clockAnimationsDisabled') === 'true';
            absoluteOptimizationToggle.checked = localStorage.getItem('clockOptimizationEnabled') === 'true';
            
            const savedFont = localStorage.getItem('clockFont') || 'font-segoe';
            fontSelect.value = savedFont;
            timeElement.className = 'time ' + savedFont;
            
            handleTogglesLogic();
            
            if (clockInterval) clearInterval(clockInterval);
            updateClock();
            clockInterval = setInterval(updateClock, 1000);
        };

        settingsIcon.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });
        secondsToggle.addEventListener('change', () => {
            saveSettings();
            updateClock();
        });
        fontSelect.addEventListener('change', () => {
            timeElement.className = 'time ' + fontSelect.value;
            saveSettings();
        });
        animationsToggle.addEventListener('change', () => {
            saveSettings();
            applyPerformanceSettings();
        });
        absoluteOptimizationToggle.addEventListener('change', () => {
            handleTogglesLogic();
            saveSettings();
            applyPerformanceSettings();
        });

        loadSettings();
    }

    const onBtn = document.getElementById('ftp-on-btn');
    const offBtn = document.getElementById('ftp-off-btn');
    if (onBtn && offBtn) {
        const toggleFTP = async (action) => {
            try {
                const response = await fetch('/toggle_ftp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: action })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    if (action === 'start') {
                        onBtn.style.display = 'block';
                        offBtn.style.display = 'none';
                    } else {
                        onBtn.style.display = 'none';
                        offBtn.style.display = 'block';
                    }
                } else {
                    alert('error: ' + result.message);
                }
            } catch (error) {
                alert('server connection error');
            }
        };

        onBtn.addEventListener('click', () => toggleFTP('stop'));
        offBtn.addEventListener('click', () => toggleFTP('start'));
    }
});