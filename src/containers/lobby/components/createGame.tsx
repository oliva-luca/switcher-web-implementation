import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './createGame.css';
import axios from 'axios'; // Importar Axios
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

interface GameResponse {
  id: string;
  name: string;
  status: string;
}

const CreateGame = () => {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState(4);
  const navigate = useNavigate(); // Usar useNavigate

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 2 && value <= 4) {
      setPlayers(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // navigate('/game'); // Redirigir a la ruta /game
    // return;
    const gameData = {
      name: name,
      cant_players: players,
    };

    const queryString = new URLSearchParams(gameData as any).toString();
    let createInfo: GameResponse = { id: '-1', name: '', status: '' };

    try {
      const response = await axios.post(`/gamelist?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      createInfo = response.data;
      console.log('Game created successfully:', createInfo);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: 'Hubo un problema al crear la partida',
      });
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const playerName = userId ? userId.toString() : 'UnknownPlayer';
      console.log('Player name:', playerName);
      console.log('Joining game');
      const joinData = {
        player_name : playerName,
      };

      const joinQueryString = new URLSearchParams(joinData as any).toString();
      const response = await axios.put(`/gamelist/${createInfo.id}?${joinQueryString}`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Game joined successfully:', response.data);
      // Redirigir a la ruta /game
      navigate('/game');

    } catch (error) {
       //borrar la partida creada con el metodo delete
      await axios.delete(`/gamelist/${createInfo.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: 'Hubo un problema al unirse a la partida',
      });
      return;
    }
  };

  return (
    <div className="container mt-5 custom-container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row align-items-center block-background">
              <label htmlFor="name" className="col-sm-4 col-form-label text-end">NOMBRE:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label htmlFor="type" className="col-sm-4 col-form-label text-end">PARTIDA PRIVADA:</label>
              <div className="col-sm-8 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckCheckedDisabled"
                    checked={isPrivate}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label htmlFor="password" className="col-sm-4 col-form-label text-end">CONTRASEÑA:</label>
              <div className="col-sm-8">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={!isPrivate}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center block-background">
              <label htmlFor="players" className="col-sm-4 col-form-label text-end">CANTIDAD DE JUGADORES:</label>
              <div className="col-sm-8">
                <input
                  type="number"
                  id="players"
                  name="players"
                  className="form-control"
                  value={players}
                  onChange={handlePlayersChange}
                  min="2"
                  max="4"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn custom-button btn-lg w-100">Crear</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;