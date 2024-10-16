import "./FigureBoard.css";
import FigureCard from "./FigureCard";
import { Player, FigCard } from "../../utils/interfaces";

interface FigureBoardProp {
  pos: string;
  deck: number;
  cards: FigCard[];
  name: string;
}

const FigureBoard = ({ pos, deck, cards, name}: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGrid ply1">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply1">{deck}</div>
          <FigureCard cardID={cards[0].id_figcard} type={cards[0].type} playerID={cards[0].id_jugador}/>
          <FigureCard cardID={cards[1].id_figcard} type={cards[1].type} playerID={cards[1].id_jugador}/>
          <FigureCard cardID={cards[2].id_figcard} type={cards[2].type} playerID={cards[2].id_jugador}/>
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridSide ply2">
          <FigureCard cardID={cards[0].id_figcard} type={cards[0].type}/>
          <FigureCard cardID={cards[1].id_figcard} type={cards[1].type}/>
          <FigureCard cardID={cards[2].id_figcard} type={cards[2].type}/>
          <div className="figureDeck ply2">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGrid ply3">
          <FigureCard cardID={cards[0].id_figcard} type={cards[0].type}/>
          <FigureCard cardID={cards[1].id_figcard} type={cards[1].type}/>
          <FigureCard cardID={cards[2].id_figcard} type={cards[2].type}/>
          <div className="figureDeck ply3">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridSide ply4">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply4">{deck}</div>
          <FigureCard cardID={cards[0].id_figcard} type={cards[0].type}/>
          <FigureCard cardID={cards[1].id_figcard} type={cards[1].type}/>
          <FigureCard cardID={cards[2].id_figcard} type={cards[2].type}/>
        </div>
      )}
    </>
  );
};

export default FigureBoard;
