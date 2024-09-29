import './Lobby.css'
import CreateGame from './components/createGame'

function App() {
  return(
    <>
    <div className="game-form"></div>
      {CreateGame()}
    </>
  )
}

export default App
