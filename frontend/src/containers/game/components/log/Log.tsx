// FILE: Log.tsx

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Log.css';
import axios from 'axios';

interface LogMessage {
    id: number;
    name: string;
    time: string;
    text: string;
}

const Log = () => {
    const [isOpen, setIsOpen] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);
    const [logMessages, setLogMessages] = useState<LogMessage[]>([]);

    // WebSocket setup
    useEffect(() => {
        const gameId = sessionStorage.getItem("gameId");
        if (!gameId) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

        socket.onopen = async () => {
            // Get logs when socket opens
            try {
                const response = await axios.get(`/gamelist/${gameId}/logs`);
                const fetchedLogs: LogMessage[] = response.data.map((log: any) => ({
                    id: log.id_mensaje,
                    name: log.autor,
                    text: log.mensaje,
                    time: new Date(log.time).toLocaleTimeString(),
                }));
                setLogMessages(fetchedLogs);
            } catch (error) {
                console.log(error);
            }
        }

        socket.onmessage = async () => {
            // Get updated logs when a new message is received
            try {
                const response = await axios.get(`/gamelist/${gameId}/logs`);
                const fetchedLogs: LogMessage[] = response.data.map((log: any) => ({
                    id: log.id_mensaje,
                    name: log.autor,
                    text: log.mensaje,
                    time: new Date(log.time).toLocaleTimeString(),
                }));
                console.log(fetchedLogs);
                setLogMessages(fetchedLogs);
            } catch (error) {
                console.log(error);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (logRef.current && !logRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleLog = () => {
        setIsOpen(!isOpen);
    };

    const closeLog = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <div className="log-container" onClick={toggleLog} role="button" aria-label="Ver historial de movimientos">
                <FontAwesomeIcon icon={faHistory} size="2x" />
                <span className="log-title">Historial</span>
            </div>
            <div ref={logRef} className={`log-interface ${isOpen ? 'open' : ''}`}>
                <div className="close-btn" onClick={closeLog} data-testid="close-button">
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