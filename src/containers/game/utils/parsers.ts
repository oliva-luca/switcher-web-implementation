import { Player, FigCard } from "./interfaces";

export function ParsePlayers(players: Player[]) {
  const firstPlayer = players.find(
    (ply) => ply.id_jugador.toString() == sessionStorage.getItem("playerId")
  )?.position;

  const order1 = players
    .filter((ply) => ply.position >= firstPlayer)
    .sort((a, b) => a.position - b.position);
  const order2 = players
    .filter((ply) => ply.position < firstPlayer)
    .sort((a, b) => a.position - b.position);

  return order1.concat(order2);
}

export function ParsePlayerFigCards(plyId: number, figcards: FigCard[]) {
  return figcards.filter((fig) => fig.id_jugador == plyId && fig.shown);
}

export function ParsePlayerFigDeck(plyId: number, figcards: FigCard[]) {
  return figcards.filter((fig) => !fig.shown && fig.id_jugador == plyId).length;
}
