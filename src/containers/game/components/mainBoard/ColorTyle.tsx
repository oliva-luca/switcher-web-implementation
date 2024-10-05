import "./ColorTyle.css";

interface ColorTyleProps {
  color: string;
  onClick: () => void;
}

const ColorTyle = ({ color, onClick }: ColorTyleProps) => (
  <button className={`colorTyle ` + color} onClick={onClick}></button>
);

export default ColorTyle;
