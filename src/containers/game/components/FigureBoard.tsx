import "./FigureBoard.css";

interface FigureBoardProp {
  pos: string;
  deck: number;
}

const FigureBoard = ({ pos, deck }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && <div className="figureBoard ply1">{deck}</div>}
      {pos == "rgt" && <div className="figureBoardSide ply2">{deck}</div>}
      {pos == "top" && <div className="figureBoard ply3">{deck}</div>}
      {pos == "lft" && <div className="figureBoardSide ply4">{deck}</div>}
    </>
  );
};

export default FigureBoard;
