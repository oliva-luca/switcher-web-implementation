import React from 'react';
import './Home.css'; // Importar el archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import {LogForm} from './components/LogForm'; // Importar el componente Form

const Home = () => {
  return (
    <div className='home-container'>
      <LogForm />
    </div>
  );
};

export default Home;