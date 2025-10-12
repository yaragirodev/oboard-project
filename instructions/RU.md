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

# 2. Развертка OBoard
я тут продолжу, щас выложу на гитхаб исходники
