# app.py
from flask import Flask, render_template, jsonify, request
import datetime
import requests
import socket
from multiprocessing import Process

# for ftp
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
import os

ftp_user = "termux"
ftp_password = "pass123"

ftp_process = None

def run_ftp_server():
    HOME = os.path.expanduser("~")
    auth = DummyAuthorizer()
    auth.add_user(ftp_user, ftp_password, HOME, perm="elradfmwM")
    handler = FTPHandler
    handler.authorizer = auth
    handler.banner = "FTP Server Ready."
    
    server = FTPServer(("0.0.0.0", 2121), handler)
    print(f"✅ FTP server running")
    server.serve_forever()

# flask app
app = Flask(__name__)

def get_ip_address():
    """get ip"""
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
    """get weather and time"""
    current_time = datetime.datetime.now().strftime("%H:%M")
    city = "Moscow"
    weather_url = f"http://wttr.in/{city}?format=%t"
    weather_data = "N/A"
    
    try:
        response = requests.get(weather_url, timeout=5)
        response.raise_for_status()
        weather_data = response.text.strip().replace('°C', '')
    except requests.exceptions.RequestException as e:
        print(f"weather fetch error: {e}")

    return render_template('index.html', time=current_time, weather=weather_data)

@app.route('/ftp')
def ftp_page():
    """ftp server page"""
    global ftp_process
    status = "ON" if ftp_process and ftp_process.is_alive() else "OFF"
    ip = get_ip_address()
    return render_template('ftp.html', ftp_status=status, ip_address=ip)

@app.route('/toggle_ftp', methods=['POST'])
def toggle_ftp():
    """API for turn on/off ftp server."""
    global ftp_process
    action = request.json.get('action')

    if action == 'start':
        if ftp_process and ftp_process.is_alive():
            return jsonify({'status': 'error', 'message': 'server is already running'})
        # starts ftp server in new process
        ftp_process = Process(target=run_ftp_server)
        ftp_process.daemon = True
        ftp_process.start()
        return jsonify({'status': 'success', 'message': 'server started!'})
        
    elif action == 'stop':
        if not ftp_process or not ftp_process.is_alive():
            return jsonify({'status': 'error', 'message': 'server isnt running right now'})
        # stopping process
        ftp_process.terminate()
        ftp_process.join()
        ftp_process = None
        return jsonify({'status': 'success', 'message': 'server stopped'})
        
    return jsonify({'status': 'error', 'message': 'wrong action'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)