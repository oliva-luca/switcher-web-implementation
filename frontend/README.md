# El Switcher (Frontend)
## Grupo: FullSnack Devs

Implementacion del frontend del juego "El Switcher", utilizando ```Vite + React + TypeScript```

## Features 

**Log In**
![Imagen Login](/front/public/readme/Login.png)

**Lobby**: Unirse a partida y creacion de partida

![Imagen Lobby](/front/public/readme/Lobby2.png)

**Pre partida**: Sala de espera hasta que el creador inicia la partida

![Imagen pre partida para creadores](/front/public/readme/pre-partida.png)
![Imagen pre partida para no creadores](/front/public/readme/pre-partida-not-owner.png)

**Partida**: Se muestra el tablero mas la mano de cartas de figura de cada jugador

![Imagen dentro de la partida](/front/public/readme/in-game.png)

## Requisitos

**Node.js y npm:**

Version Node.js: 18 o superior

```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt-get install nodejs
$ sudo apt install npm
```

**Librerias especificas:** 

Especificados en ```vite.config.ts```, los mismos pueden ser instalados con:
```bash
$ npm install
```

## Como correr

### Levantar frontend:

En la carpeta raiz del frontend

```bash
$ npm run dev
```

![imagen vite](/front/public/readme/vite.png)

Ya se puede ingresar a la aplicacion en [http://localhost:5173](http://localhost:5173)

El frontend debe estar acompaÃ±ado del backend (idealmente en un directorio diferente)
```bash
$ git clone https://github.com/IngSoft1-FullSnackDevs/backend.git
```

Una vez alli crear el entorno virtual en el cual instalaremos las dependencias

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
```
```bash
$ uvicorn app:app --reload
```

Podemos acceder al backend desde
[http://localhost:8000](http://localhost:8000)

Con todo esto funcionando podemos utilizar la aplicacion web sin problemas