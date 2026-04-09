# Backend 

## Cómo correr el programa

1. Crear un entorno virtual 
2. Dentro del proyecto y el entorno creado 
        
        pip install -r requirements.txt

3. Cambiar el ENVIROMENT usado para la bd

        export ENVIROMENT=development

4. Levantar la app 

        uvicorn app:app --reload

5. Si se quiere ejecutar algún pedido ingresar en http://127.0.0.1:8000 


## Cómo correr los tests 

Si por alguna razón ya sea, no estaba en el entorno virtual o alguna otra razón los test fallan, borrar la base de datos llamada database_test.sqlite y correr de nuevo, sino afecta a los demas tests

1. Crear un entorno virtual si es que no se creó antes  
2. Dentro del proyecto y el entorno creado 
        
        pip install -r requirements.txt

3. Para los tests unitarios correr 

        make run_unit_tests

4. Para los test de integración correr 

        make run_integration_tests

5. Para correr todos los test juntos 

        make run_all_tests



## Módulos 

## App 

El módulo app contiene todos los endpoints necesarios para conseguir, actualizar, eliminar o crear información 

Este módulo no maneja nada acerca base de datos, para eso, cada endpoint se asocia con una función del archivo Operation

Los endpoints son: 


* **@app.get("/gamelist")** = Trae la información de todas las partidas existentes con todos sus atributos 

* **@app.get("/tableros/{game_id}")** = Trae la información del tablero relacionado con el game que tenga ese game_id

* **@app.get("/user")** = Devuelve todos los users que estan en la base de datos con sus jugadores asignados 

* **@app.post("/gamelist")** = Crea una nueva partida con los datos solicitados 

* **@app.put("/gamelist/join/{game_id}")** = Une a un jugador a la partida especificada por el game_id, el id_player se pasa por parameter

* **@app.post("/user")** = Crea un nuevo usuario a partir de un nombre

* **@app.put("/gamelist/start/{game_id}")** = Cambia el estado de una partida no iniciada a iniciada y hace las operaciones correspondientes para iniciarla (sortear los colores del tablero, rapertir las cartas, etc) 

* **@app.get("/gamelist/{game_id}")** = Trae la información de un game en específico con su game_id

* **@app.put("/end_turn/{game_id}")** = Cambia el turno del jugador actual por el siguiente 

* **@app.get("/user/{player_id}")** = Devuelve la información de un jugador en específico 

* **@app.put("/gamelist/leave/{player_id}")** = Saca a un jugador de una partida que ya está iniciada 

* **@app.put("/gamelist/leave_lobby/{player_id}")** = Saca a un jugador de una partida que todavía no se inicia 

* **@app.put("/gamelist/{game_id}/playcard/{mov_card_id}/casillas/{casilla_id1}/{casilla_id2}")**  = En una partida toma una carta de movimiento y realiza el cambio entre dos casillas 

* **@app.put("/gamelist/cancelmoves/{game_id}")** = Cancela los movimientos parciales encolados en una partida

* **@app.put("/gamelist/{game_id}/discard_figcard/{figcard_id}/color/{color}")** = De una partida toma una carta de figura y la descarta estableciendo un nuevo color prohibido

* **@app.put("/gamelist/{game_id}/block_figcard/{figcard_id}/color/{color}")** = De una partida toma una carta de figura y la bloquea estableciendo un nuevo color prohibido

* **@app.get("/gamelist/turn_time/{game_id}")** = Devuelve el tiempo actual que le queda a un turno en una partida especifica

* **@app.get("/gamelist/{game_id}/logs")** = Devuelve los logs pertenecientes a una partida en especifico 

* **@app.get("/gamelist/{game_id}/chat")** = Devuelve el chat de una partida en especifico 

* **@app.post("/gamelist/mensaje/{game_id}/{player_id}/{mensaje}")** = Pega un mensaje de un jugador en el chat de la partida 

* **@app.websocket("/ws")** = Conector de websocket que maneja la información de las salas existentes 

* **@app.websocket("/ws/game/{game_id}")** = Conector de websocket que regula la información de una partida en específico 



## Operation 

Primer apartado designado para las excepciones creadas por nosotros para saber que excepción levantar del lado del archivo app 


**Class ConnectionManager** 

Define las funcionalidades de los ws con sus funciones asignadas para brodcastear información de un end al otro 

**Class Operations**

Funciones ligadas a un endpoint en específico, son las responsables de abrir las sesiones para conectarse con la base de datos, hacer los cambios pertinentes y luego cerrar la sesión 

## Utils 

Archivo con funciones auxiliares no referidas en particular a ningun endpoint o que evitan duplicacion de codigo y poder hacer cambios en un solo archivo permitiendo asi mantener el acoplamiento bajo

## Exception

Archivo dedicado a definir las excepciones que nuestro programa deberia manejar 


## Models 

Archivo que define la estructura de la base de datos, tenemos definidas 6 tablas: 

**Game** = Guarda la información de una partida, tiene una relación con un tablero y una lista de Players que son los que pertencen a esa partida.

**Player** = Guarda la información de un jugador.

**Tablero** = Guarda la información de un tablero y se relaciona con una partida cuando esta está iniciada, tiene una relación con las casillas de uno a muchos ya que un tablero alberga muchas casillas (específicamente 36 casillas)

**Casillas** = Guarda la información de una casilla, su color, posicion y etc. 

**MovCard** = Guarda la información de una carta de movimiento, tiene una relación con la partida a la que estan ligada y una relación con el jugador actual que tiene esa carta (si es que existe)

**FigCard** = Guarda la información de una carta de figura, tiene una relacion con la partida a la que estan ligada y una relación con el jugador actual que tiene esa carta (si es que existe)


## Módulos de Test

## populate_test_db 

Cargamos datos a mano en una base de datos de prueba para que se use en los test de integración y end2end.

## test_app 

Contiene las pruebas unitarias del proyecto, estas pruebas están totalmente aisladas de la base de datos o la aplicacion en sí, estas pueden correrse solitariamente, su cometido es comprobar que los modulos unitarios trabajen bien si es que la información que maneja es correcta. 


## test_operation_integration

Son los test de integración, todas las funcionalidades de Operation que hacen cambios relevantes en la base de datos, se apoya en el archivo populate_test_db, ya que las operaciones que realiza necesitan manejar datos reales y no información mockeada como en los test unitarios. 

## Modifies to test 

Archivo que contiene una lista de cambios en el tablero para usar en test de operaciones referentes a los movimientos parciales

## test utils 

Son los test referentes a las operaciones desarolladas en el modulo utils

## config 

Encargado de reemplazar el valor de la variable ENVIROMENT para que se cree una base de datos de diferente nombre dependiendo de el valor de la variable. 


## pytest_ini

Define las marcas para la ejecucion del make.



