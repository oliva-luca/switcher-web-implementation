# Backend 

## Decisiones con respecto al diseño

Vamos a trabajar con estructuras que tengan la informacion pertinente de cada tipo que creemos para el uso 

Los tipos de las demas variables importantes al juego van a seguir el mismo modelo struct heredado de BaseModel 


## Endpoints 

### Endpoints relacionados a creacion de partida y integracion de usuarios 


* @app.post(/game) 

* @app.get(/game_list)

* @app.get(/game_list/{game_id})

* @app.post(/user) (query parameter de nombre de usuario)


* @app.put(/join_game/{game_id}) (query parameter de jugador) post de crear jugador


* @app.put(/leave_game/{game_id}/player/{player_id})


### Detalle de cada Endpoint


@app.post(/game) = Encargado de crear la partida y asignarle el id de partida 


@app.get(/gamelist) = Obtiene la lista de partidas creadas y no iniciadas

@app.get(/game_list/{game_id}) = Obtiene la informacion de una partida en especifico 


@app.post(/user) = Creacion de la estructura que contiene la informacion del usuario, al unirse a la pagina 


@app.put(/join_game/{game_id}) = Cambia la informacion de los jugadores placeholder de la partida 

@app.put(/leave_game/{game_id}/player/{player_id}) = Cambia la informacion de un jugador que estaba en una partida al valor default de jugador cuando se crea la partida 





