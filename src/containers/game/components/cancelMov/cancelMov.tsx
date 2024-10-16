import React, { useEffect, useState } from 'react';
import './cancelMov.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importar Axios
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CancelMov = () => {
    const cancel = () => {
        alert('Movimientos cancelados');
        // hacer el get del tablero

        // desblurear las cartas

        // animacion del luca
    }
    
    return (
        <button 
        type="submit" 
        className="btn btn-lg w-20 bottom-cancel" 
        onClick={cancel}>
        CANCELAR MOVIMIENTOS
        </button>
    );
    
}

export default CancelMov;