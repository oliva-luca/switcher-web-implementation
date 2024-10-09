export interface Casilla {
  id_casilla: number;
  color: string;
  columna: number;
  fila: number;
  id_tablero: number;
}

export interface BoardData {
  color_principal: number;
  id_tablero: number;
  casillas: Casilla[];
}
