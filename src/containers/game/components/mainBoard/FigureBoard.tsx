import "./FigureBoard.css";
import FigureCard from "./FigureCard";

interface FigureBoardProp {
  pos: string;
  deck: number;
  cards: number[];
  name: string;
}

const FigureBoard = ({ pos, deck, cards, name }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGridBtm ply1">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply1">{deck}</div>
          <FigureCard card={cards[0]} />
          <FigureCard card={cards[1]} />
          <FigureCard card={cards[2]} />
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridRgt ply2">
          <FigureCard card={cards[0]} />
          <FigureCard card={cards[1]} />
          <FigureCard card={cards[2]} />
          <div className="figureDeck ply2">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGridTop ply3">
          <FigureCard card={cards[0]} />
          <FigureCard card={cards[1]} />
          <FigureCard card={cards[2]} />
          <div className="figureDeck ply3">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridLft ply4">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply4">{deck}</div>
          <FigureCard card={cards[0]} />
          <FigureCard card={cards[1]} />
          <FigureCard card={cards[2]} />
        </div>
      )}
    </>
  );
};

export default FigureBoard;