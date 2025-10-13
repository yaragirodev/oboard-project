from flask import Flask, render_template, jsonify, request, send_from_directory
import datetime
import requests
import socket
from multiprocessing import Process
import os
import subprocess

ftp_user = "termux"
ftp_password = "pass123"
ftp_process = None

def run_ftp_server():
    from pyftpdlib.authorizers import DummyAuthorizer
    from pyftpdlib.handlers import FTPHandler
    from pyftpdlib.servers import FTPServer
    
    HOME = os.path.expanduser("~")
    auth = DummyAuthorizer()
    auth.add_user(ftp_user, ftp_password, HOME, perm="elradfmwM")
    handler = FTPHandler
    handler.authorizer = auth
    handler.banner = "FTP Server Ready."
    
    server = FTPServer(("0.0.0.0", 2121), handler)
    print("✅ FTP server running")
    server.serve_forever()

app = Flask(__name__)
app.config['MUSIC_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music')

def get_ip_address():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@app.route('/')
def clock_page():
    current_time = datetime.datetime.now().strftime("%H:%M")
    city = "Moscow"
    weather_url = f"http://wttr.in/{city}?format=%t"
    weather_data = "N/A"
    
    try:
        response = requests.get(weather_url, timeout=5)
        response.raise_for_status()
        weather_data = response.text.strip().replace('°C', '')
    except requests.exceptions.RequestException as e:
        print(f"Weather fetch error: {e}")

    return render_template('index.html', time=current_time, weather=weather_data)

@app.route('/ftp')
def ftp_page():
    global ftp_process
    status = "ON" if ftp_process and ftp_process.is_alive() else "OFF"
    ip = get_ip_address()
    return render_template('ftp.html', ftp_status=status, ip_address=ip)

@app.route('/toggle_ftp', methods=['POST'])
def toggle_ftp():
    global ftp_process
    action = request.json.get('action')

    if action == 'start':
        if ftp_process and ftp_process.is_alive():
            return jsonify({'status': 'error', 'message': 'FTP server is already running'})
        ftp_process = Process(target=run_ftp_server)
        ftp_process.daemon = True
        ftp_process.start()
        return jsonify({'status': 'success', 'message': 'FTP server started'})
        
    elif action == 'stop':
        if not ftp_process or not ftp_process.is_alive():
            return jsonify({'status': 'error', 'message': 'FTP server is not running'})
        ftp_process.terminate()
        ftp_process.join()
        ftp_process = None
        return jsonify({'status': 'success', 'message': 'FTP server stopped'})
        
    return jsonify({'status': 'error', 'message': 'Invalid action'})

@app.route('/ssh')
def ssh_page():
    try:
        result = subprocess.run(['systemctl', 'is-active', 'ssh'], capture_output=True, text=True)
        status = "ON" if result.stdout.strip() == 'active' else "OFF"
    except FileNotFoundError:
        status = "Unknown"
    ip = get_ip_address()
    return render_template('ssh.html', ssh_status=status, ip_address=ip)

@app.route('/toggle_ssh', methods=['POST'])
def toggle_ssh():
    action = request.json.get('action')
    command = ['systemctl', action, 'sshd']
    
    try:
        subprocess.run(command, check=True)
        return jsonify({'status': 'success', 'message': f'SSH server {action}ed'})
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        return jsonify({'status': 'error', 'message': f'Failed to {action} SSH server. Is it installed? Do you have sudo rights? Error: {e}'})

@app.route('/music')
def music_page():
    return render_template('music.html') # in beta

@app.route('/api/songs')
def get_songs():
    try:
        music_files = [f for f in os.listdir(app.config['MUSIC_FOLDER']) if f.endswith(('.mp3', '.wav', '.ogg'))]
        return jsonify(music_files)
    except FileNotFoundError:
        return jsonify([])

@app.route('/music_files/<path:filename>')
def serve_music(filename):
    return send_from_directory(app.config['MUSIC_FOLDER'], filename)

@app.route('/whiteboard')
def whiteboard_page():
    return render_template('whiteboard.html')

if __name__ == '__main__':
    if not os.path.exists(app.config['MUSIC_FOLDER']):
        os.makedirs(app.config['MUSIC_FOLDER'])
        print(f"Created music folder at: {app.config['MUSIC_FOLDER']}")
    app.run(host='0.0.0.0', port=5000)
