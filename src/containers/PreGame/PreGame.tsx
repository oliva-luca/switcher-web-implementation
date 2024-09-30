import "./PreGame.css";
import StartBtn from "./components/StartBtn/StartBtn";
import CantPlayer from "./components/CantPlayer/CantPlayer";

function PreGame() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="top-left-text" style={{ zIndex: 3 }}>
          <CantPlayer />
        </div>
        <div className="blank-screen"></div>
        <div className="content" style={{ zIndex: 1 }}></div>
        <div style={{ zIndex: 3 }}>
          <StartBtn />
        </div>
      </div>
    </>
  );
}

export default PreGame;
