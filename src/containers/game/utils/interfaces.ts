export interface Casilla {
  id_casilla: number;
  color: string;
  figura: number;
  columna: number;
  fila: number;
  id_tablero: number;
}

export interface BoardData {
  color_prohibido: string;
  id_tablero: number;
  casillas: Casilla[];
}

export interface Player {
  id_jugador: number;
  block: boolean;
  id_partida: number;
  nombre: string;
  in_game: boolean;
  position: number;
}

export interface MovCard {
  id_partida: number;
  type: number;
  id_movcard: number;
  id_jugador: number;
  state: boolean;
}

export interface FigCard {
  type: number;
  shown: boolean;
  id_jugador: number;
  id_figcard: number;
  id_partida: number;
  blocked: boolean;
}

export interface GameData {
  id_partida: number;
  name: string;
  started: boolean;
  password: string;
  owner: string;
  cant_jugadores: number;
  is_private: boolean;
  turn: number;
  id_tablero: number;
  players: Player[];
  movcards: MovCard[];
  figcards: FigCard[];
}
