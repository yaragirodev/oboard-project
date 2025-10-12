# OBoard 
### Интерактивная панель для вашего устройства с Termux!
<br>

# 1. Подготовка устройства
### 1.1. Установите Termux
Лучше скачивать его либо с [F-Droid](https://f-droid.org/ru/packages/com.termux/index.html) либо с [GitHub](https://github.com/termux/termux-app/releases), потому что в Google Play устарелая версия.

### 1.2. Установите proot-distro
`proot-distro` - это утилита в Termux для запуска Linux-дистрибутивов в отдельной от Android среде.

Чтобы установить ее напишите:
```bash
pkg update
pkg install proot-distro
```

### 1.3. Установите дистрибутив
Я рекомендую устанавливать **Debian** или **Ubuntu**, так как они мало весят, и довольно стабильны.

Выполните:
```bash
proot-distro install debian
# или любой другой дистрибутив, полный список можно посмотреть написав proot-distro list
```

### 1.4. Зайдите в ваш установленный дистрибутив
```bash
proot-distro login debian
```

### 1.5. Установите все необходимое
Для работы приложения необходим Python и curl, если он не установлен, установите.
```bash
apt update && apt upgrade -y
apt install python3 curl
```
Нужные библиотеки в Python:
```bash
pip install flask requests pyftpdlib
```
А также LXDE, tigervnc-server и git:
```bash
apt install lxde tigervnc-standalone-server git -y
```

# 2. Развертка OBoard

### 2.1. Настройка VNC, запуск LXDE и подключение через VNC Viewer на ПК
Настройте запуск LXDE:
```bash
mkdir -p ~/.vnc
echo -e '#!/bin/sh\nxrdb $HOME/.Xresources\nstartlxde &' > ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup
```

Задайте пароль VNC:
```bash
vncserver :1
```

После завершите процесс VNC для применения пароля:
```bash
vncserver -kill :1
```

### 2.2. Запуск LXDE!
Запустите VNC сервер с LXDE под ваше разрешение:
```bash
vncserver :1 -geometry 2160x1080 -depth 24 -localhost no
```

``-localhost no`` - служит для того чтобы вы могли подключится к этому серверу с другого устройства.

### 2.3. Подключение с ПК, развертка OBoard
#### Если у вас **Linux**:
Скачивайте ``tigervnc-viewer``

```bash
sudo apt install tigervnc-viewer
```

После чего в Termux напишите команду ``ifconfig``, у вас будет примерно такой вывод:
```bash
eno1: flags=<...><UP,BROADCAST,RUNNING,MULTICAST>  mtu <...>
        inet 192.168.1.12 (ПРИМЕР)  netmask <...>  broadcast <...>
```
Вам нужен этот IP.
<br>
Запустите TigerVNC Viewer, вставьте ваш IP и напишите порт ``5901``

После введите пароль, тот что вводили при запуске команды ``vncserver :1``
![viewerGUI](tigervncviewer.png)

#### Если у вас **Windows**:
Скачайте **TigerVNC Viewer** с [официального сайта](https://sourceforge.net/projects/tigervnc/files/stable/).
Установите и запустите.
В поле *"VNC Server"* введите:

   ```
   <ваш-IP>:5901
   ```

Например: `192.168.1.12:5901`

Нажмите **Connect** — готово.

---

#### Если у вас **macOS**:
Установите через Homebrew:

   ```bash
   brew install tigervnc-viewer
   ```

   или скачайте `.dmg` с сайта TigerVNC.
Аналогично, вводите:

   ```
   <ваш-IP>:5901
   ```

---

*Важно:*
ПК и телефон должны быть **в одной Wi-Fi сети** (иначе VNC не подключится).

---
#### После подключения:

![lxterm](lxterm.png)

Откройте LXTerm, Склонируйте репозиторий:
```bash
git clone https://github.com/yaragirodev/oboard-project.git
```

После чего откройте файловый менеджер (PCMan), и откройте папку ``oboard-project``:

![pcman-folder](folders.png)

Тут вы можете удалить папку ``instructions`` если вы все знаете, и она вам мешает.

Так как вы все уже установили, в терминале заходите в папку и запускайте flask-сервер:
```bash
cd oboard-project
python app.py
```

Готово! Сервер с интерфейсом запущен!

### 2.4. Запуск интерфейса, его показ на экране вашего устройства
#### Проверьте порт на котором запущен ваш интерфейс
После запуска скрипта, в терминале появится лог:

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

Скопируйте ``http://127.0.0.1:5000`` или ``http://192.168.1.12:5000``,
запустите новый терминал и напишите:

```bash
firefox --kiosk <ВАШ URL>
```

У вас запустится Firefox (он уже установлен в LXDE) с интерфейсом OBoard!

#### Запуск на экране самого устройства
На своем устройстве, скройте Termux (НЕ ЗАКРЫВАЙТЕ!)

Перейдите по [ссылке](https://github.com/gujjwal00/avnc), или просто напишите в поиске ``avnc``.

Скачайте приложение AVNC и установите его.

##### В приложении AVNC:
![avnc_login](avnc1.png)

Введите IP своего устройства, порт ``5901``, и пароль от VNC.

Нажмите ``сохранить``, и выберите свое подключение в списке.

ГОТОВО!
