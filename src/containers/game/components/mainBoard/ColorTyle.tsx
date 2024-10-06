import "./ColorTyle.css";

interface ColorTyleProps {
  col: number;
  row: number;
  color: string;
  selected: [number, number] | null;
  setSelected: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const ColorTyle = ({
  color,
  col,
  row,
  selected,
  setSelected,
}: ColorTyleProps) => (
  <button
    className={`colorTyle ` + color}
    onClick={() => setSelected(selected == null ? [col, row] : null)}
    disabled={selected != null && (selected[0] != col || selected[1] != row)}
  ></button>
);

export default ColorTyle;
