import React from 'react';
import './Home.css'; // Importar el archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from './components/Form'; // Importar el componente Form

const Home = () => {
  return (
    <div className='home-container'>
      <Form />
    </div>
  );
};

export default Home;