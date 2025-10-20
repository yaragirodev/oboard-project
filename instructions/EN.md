# OBoard

### Interactive panel for your Termux device


## 1. Device preparation

### 1.1. Install Termux

It’s recommended to download Termux from [F-Droid](https://f-droid.org/ru/packages/com.termux/index.html) or [GitHub](https://github.com/termux/termux-app/releases), because the Google Play version is outdated.

---

### 1.2. Install proot-distro

`proot-distro` is a Termux utility to run Linux distributions in a separate environment on Android.

To install, run:

```bash
pkg update
pkg install proot-distro
```

---

### 1.3. Install a Linux distribution

I recommend **Debian** or **Ubuntu**, as they are lightweight and stable.

```bash
proot-distro install debian
# Or any other distro. To see the full list, run:
proot-distro list
```

---

### 1.4. Log in to your installed distribution

```bash
proot-distro login debian
```

---

### 1.5. Install required packages

For the app to work, you need Python and curl. If not installed, run:

```bash
apt update && apt upgrade -y
apt install python3 curl
```

Required Python libraries:

```bash
pip install flask requests pyftpdlib
```

Also install LXDE, tigervnc-server, and git:

```bash
apt install lxde tigervnc-standalone-server git -y
```

---

## 2. Deploying OBoard

### 2.1. Configure VNC, start LXDE, and connect via VNC Viewer on PC

Set up LXDE startup:

```bash
mkdir -p ~/.vnc
echo -e '#!/bin/sh\nxrdb $HOME/.Xresources\nstartlxde &' > ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup
```

Set VNC password:

```bash
vncserver :1
```

Then stop the server to apply the password:

```bash
vncserver -kill :1
```

---

### 2.2. Start LXDE

Start the VNC server with LXDE and your preferred resolution:

```bash
vncserver :1 -geometry 2160x1080 -depth 24 -localhost no
```

`-localhost no` allows you to connect from another device.

---

### 2.3. Connect from PC

#### Linux

Install TigerVNC Viewer:

```bash
sudo apt install tigervnc-viewer
```

Check your device’s IP (in termux):

```bash
ifconfig
```

Example output:

```bash
eno1: flags=<...><UP,BROADCAST,RUNNING,MULTICAST>  mtu <...>
        inet 192.168.1.12  netmask <...>  broadcast <...>
```

You need the `inet` address (example: `192.168.1.12`).

Open TigerVNC Viewer, enter your IP and port `5901`, then enter the password set earlier.
![viewerGUI](tigervncviewer.png)

---

#### Windows

1. Download **TigerVNC Viewer** from the [official site](https://sourceforge.net/projects/tigervnc/files/stable/).
2. Install and run it.
3. In the *VNC Server* field, enter:

   ```
   <your-IP>:5901
   ```

   Example: `192.168.1.12:5901`
4. Click **Connect** and enter your password.

---

#### macOS

Install via Homebrew:

```bash
brew install tigervnc-viewer
```

Or download the `.dmg` from the TigerVNC website.
Enter your server address in the same format:

```
<your-IP>:5901
```

---

**Important:** Your PC and phone must be connected to the **same Wi-Fi network**, otherwise VNC will not connect.

---

#### After connecting

![lxterm](lxterm.png)

Open LXTerminal and clone the repository:

```bash
git clone https://github.com/yaragirodev/oboard-project.git
```

Then open the file manager (PCManFM) and navigate to the `oboard-project` folder:

![pcman-folder](folders.png)

You can remove the `instructions` folder if you no longer need it.

Open the terminal, go to the project folder, and start the Flask server:

```bash
cd oboard-project
python app.py
```

The server with the interface is now running.

---

### 2.4. Launch the interface on your device screen

#### Check the port your interface is running on

After starting the script, the terminal will show:

```bash
root@localhost:~/Documents/OBoard/oboard# python app.py
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.12:5000
Press CTRL+C to quit
 * Restarting with stat
```

Copy either `http://127.0.0.1:5000` or `http://192.168.1.12:5000`, open a new terminal, and run:

```bash
firefox --kiosk <YOUR URL>
```

Firefox will start in kiosk mode with the OBoard interface.

---

### 2.5. Running directly on your device

Minimize Termux (do **not** close it!).
Install the **AVNC** app from [GitHub](https://github.com/gujjwal00/avnc) or Google Play.

#### In AVNC:

![avnc\_login](avnc1.png)

1. Enter your device IP, port `5901`, and VNC password.
2. Click **Save** and select your connection in the list.

Done! You should now see LXDE and the OBoard interface on your device screen.
