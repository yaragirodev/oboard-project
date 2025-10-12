# OBoard

### Интерактивная панель для вашего устройства с Termux

---

## 1. Подготовка устройства

### 1.1. Установка Termux

Рекомендуется скачивать Termux с [F-Droid](https://f-droid.org/ru/packages/com.termux/index.html) или [GitHub](https://github.com/termux/termux-app/releases).
Версия из Google Play **устарела**.

---

### 1.2. Установка proot-distro

`proot-distro` — утилита для запуска Linux-дистрибутивов в отдельной среде внутри Android.

Установите её командами:

```bash
pkg update
pkg install proot-distro
```

---

### 1.3. Установка дистрибутива

Рекомендуется **Debian** или **Ubuntu**, так как они лёгкие и стабильные.

```bash
proot-distro install debian
# Или другой дистрибутив. Список доступных:
proot-distro list
```

---

### 1.4. Вход в установленный дистрибутив

```bash
proot-distro login debian
```

---

### 1.5. Установка зависимостей

Необходимые пакеты:

```bash
apt update && apt upgrade -y
apt install python3 curl
```

Установите Python-библиотеки:

```bash
pip install flask requests pyftpdlib
```

Дополнительные пакеты:

```bash
apt install lxde tigervnc-standalone-server git -y
```

---

## 2. Развёртывание OBoard

### 2.1. Настройка VNC, запуск LXDE и подключение с ПК

Создайте конфигурацию VNC:

```bash
mkdir -p ~/.vnc
echo -e '#!/bin/sh\nxrdb $HOME/.Xresources\nstartlxde &' > ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup
```

Задайте пароль VNC:

```bash
vncserver :1
```

Затем завершите процесс для применения пароля:

```bash
vncserver -kill :1
```

---

### 2.2. Запуск LXDE

Запустите VNC-сервер с нужным разрешением:

```bash
vncserver :1 -geometry 2160x1080 -depth 24 -localhost no
```

Параметр `-localhost no` позволяет подключаться с других устройств в сети.

---

### 2.3. Подключение с ПК

#### Linux

Установите TigerVNC Viewer:

```bash
sudo apt install tigervnc-viewer
```

Посмотрите IP-адрес устройства (termux):

```bash
ifconfig
```

Пример вывода:

```bash
eno1: flags=<...><UP,BROADCAST,RUNNING,MULTICAST>  mtu <...>
        inet 192.168.1.12  netmask <...>  broadcast <...>
```

Нужен адрес `inet` (в примере — `192.168.1.12`).

Запустите TigerVNC Viewer и введите:

```
192.168.1.12:5901
```

Введите пароль, заданный ранее в `vncserver :1`.

![viewerGUI](tigervncviewer.png)

---

#### Windows

1. Скачайте **TigerVNC Viewer** с [официального сайта](https://sourceforge.net/projects/tigervnc/files/stable/).
2. Установите и запустите.
3. В поле *VNC Server* введите:

   ```
   <ваш-IP>:5901
   ```

   Например: `192.168.1.12:5901`
4. Нажмите **Connect** и введите пароль.

---

#### macOS

Установите через Homebrew:

```bash
brew install tigervnc-viewer
```

Или скачайте `.dmg` с сайта TigerVNC.
В поле сервера укажите:

```
<ваш-IP>:5901
```

---

**Важно:** ПК и телефон должны быть подключены к **одной Wi-Fi сети**, иначе VNC не подключится.

---

#### После подключения

![lxterm](lxterm.png)

Откройте LXTerminal и выполните:

```bash
git clone https://github.com/yaragirodev/oboard-project.git
```

Далее откройте файловый менеджер (PCManFM) и перейдите в папку `oboard-project`:

![pcman-folder](folders.png)

При желании можно удалить папку `instructions`, если вы всё уже знаете.

Перейдите в каталог проекта и запустите Flask-сервер:

```bash
cd oboard-project
python app.py
```

Сервер успешно запущен.

---

### 2.4. Запуск интерфейса OBoard

После запуска появится лог:

```bash
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.12:5000
```

Скопируйте адрес (например, `http://127.0.0.1:5000`) и запустите:

```bash
firefox --kiosk <ваш_URL>
```

Firefox откроется в режиме киоска с интерфейсом OBoard.

---

### 2.5. Запуск на экране самого устройства

Сверните Termux (не закрывайте его!).
Установите приложение **AVNC** с [GitHub](https://github.com/gujjwal00/avnc) или из Google Play.

В AVNC:

1. Укажите IP устройства.
2. Порт: `5901`.
3. Введите пароль от VNC.
4. Сохраните подключение и выберите его в списке.

![avnc\_login](avnc1.png)

После подключения вы увидите LXDE прямо на экране устройства.

Готово — OBoard запущен!
