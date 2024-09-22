import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './createGame.css';
import axios from 'axios'; // Importar Axios

const CreateGame = () => {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState(4);

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
    
    const gameData = {
      name,
      players,
    };

    const queryString = new URLSearchParams(gameData as any).toString();

    try {
      // console.log('Creating game:', gameData);
      const response = await axios.post(`/gamelist?${queryString}`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Game created successfully:', response.data);
      // Puedes manejar la respuesta aquí, por ejemplo, redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error('There was a problem with the POST request:', error);
      // Puedes manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
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
            <button type="submit" className="btn custom-button w-100">CREAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;