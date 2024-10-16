import { Player, FigCard } from "./interfaces";

export function ParsePlayers(players: Player[]) {
  var order = new Array(players.length);
  order[0] = players.find(
    (ply) => ply.id_jugador.toString() == localStorage.getItem("userId")
  );
  for (let i = 1; i < players.length; i++) {
    order[i] = players.find(
      (ply) =>
        ply.position == order[i - 1].position + 1 ||
        (order[i - 1].position == players.length - 1 && ply.position == 0)
    );
  }
  console.log(order);
  return order;
}

export function ParsePlayerFigCards(plyId: number, figcards: FigCard[]) {
  return figcards.filter((fig) => fig.id_jugador == plyId && fig.shown);
}

export function ParsePlayerFigDeck(plyId: number, figcards: FigCard[]) {
  return figcards.filter((fig) => !fig.shown && fig.id_jugador == plyId).length;
}
