import "./FigureCard.css";

interface FigureCardProp {
  kind: boolean;
  card: number;
}

const FigureCard = ({ kind, card }: FigureCardProp) => {
  return (
    <img
      src={
        kind
          ? "fige0" + card + ".svg"
          : card < 10
          ? "fig0" + card + ".svg"
          : "fig" + card + ".svg"
      }
      alt="Fig"
    />
  );
};

export default FigureCard;
