import "./FigureBoard.css";

interface FigureBoardProp {
  pos: string;
  deck: number;
}

const FigureBoard = ({ pos, deck }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGridBtm">
          <div className="figureDeck ply1">{deck}</div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridRgt">
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck ply2">{deck}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGridTop">
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck"></div>
          <div className="figureDeck ply3">{deck}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridLft">
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
