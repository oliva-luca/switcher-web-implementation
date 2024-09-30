import "./FigureBoard.css";
import FigureCard from "./FigureCard";

interface FigureBoardProp {
  pos: string;
  deck: number;
}

const FigureBoard = ({ pos, deck }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGridBtm ply1">
          <div className="figureDeck ply1Light">{deck}</div>
          <FigureCard kind={false} card={1} />
          <FigureCard kind={true} card={3} />
          <FigureCard kind={false} card={15} />
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridRgt ply2">
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
          <div className="figureDeck ply2Light">{deck}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGridTop ply3">
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
          <div className="figureDeck ply3Light">{deck}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridLft ply4">
          <div className="figureDeck ply4Light">{deck}</div>
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
          <FigureCard kind={false} card={1} />
        </div>
      )}
    </>
  );
};

export default FigureBoard;
