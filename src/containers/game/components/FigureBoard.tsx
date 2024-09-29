import "./FigureBoard.css";

interface FigureBoardProp {
  pos: string;
  deck: number;
}

const FigureBoard = ({ pos, deck }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGridBtm ply1">
          <div className="figureDeck ply1">{deck}</div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridRgt ply2">
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck ply2">{deck}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGridTop ply3">
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck ply3">{deck}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridLft ply4">
          <div className="figureDeck ply4">{deck}</div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
        </div>
      )}
    </>
  );
};

export default FigureBoard;
