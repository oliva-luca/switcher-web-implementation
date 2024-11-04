// FILE: Log.tsx

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Log.css';

interface LogMessage {
    id: number;
    name: string;
    time: string;
    text: string;
}

const Log = () => {
    const [isOpen, setIsOpen] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);
    const [logMessages, setLogMessages] = useState<LogMessage[]>([
        {
            id: 1,
            name: 'Sistema',
            time: '10:00 AM',
            text: 'La partida ha comenzado.',
        },
        {
            id: 2,
            name: 'Jugador 1',
            time: '10:05 AM',
            text: 'Jugador 1 ha movido su pieza.',
        },
        // Agrega más mensajes según sea necesario
    ]);

    const toggleLog = () => {
        setIsOpen(!isOpen);
    };

    const closeLog = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (logRef.current && !logRef.current.contains(event.target as Node)) {
            closeLog();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <div className="log-container" onClick={toggleLog} role="button" aria-label="Ver historial de movimientos">
                <FontAwesomeIcon icon={faHistory} size="2x" />
                <span className="log-title">Historial</span>
            </div>
            <div ref={logRef} className={`log-interface ${isOpen ? 'open' : ''}`}>
                <div className="close-btn" onClick={closeLog}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h1>Historial de Movimientos</h1>
                <div className="history-container">
                    {logMessages.map((msg) => (
                        <div key={msg.id} className="history-message">
                            <div className="history-header">
                                <span className="history-name">{msg.name}</span>
                                <span className="history-time">{msg.time}</span>
                            </div>
                            <div className="history-text">{msg.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Log;