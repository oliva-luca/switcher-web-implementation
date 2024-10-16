import { Player, FigCard } from "./interfaces";

export function ParsePlayers(players: Player[]) {
  var order = new Array(players.length);
  order[0] = players.find(
    (ply) => ply.id_jugador.toString() == localStorage.getItem("userId")
  );

  const findPlayer = (n: number) => {
    n = n == players.length - 1 ? -1 : n;
    var candidate = players.length;
    var pos = 0;
    for (let i = 0; i < players.length; i++) {
      if (players[i].position < candidate && players[i].position > n) {
        candidate = players[i].position;
        pos = i;
      }
    }
    return players[pos];
  };

  for (let i = 1; i < players.length; i++) {
    order[i] = findPlayer(order[i - 1].position);
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
