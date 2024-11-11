import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './chat.css';
import axios from 'axios';

interface Message {
    id: number;
    name: string;
    id_autor: number;
    time: string;
    text: string;
}

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]); // Estado para almacenar los mensajes
    const playerId = sessionStorage.getItem('playerId');
    const gameId = sessionStorage.getItem('gameId');

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
            closeChat();
        }
    };

    useEffect(() => {
        if (!gameId || !playerId) return;
    
        const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);
    
        socket.onopen = async () => {
            try {
                const response = await axios.get(`/gamelist/${gameId}/chat`);
                const fetchedLogs: Message[] = response.data.map((log: any) => ({
                    id: log.id_mensaje,
                    name: log.autor,
                    id_autor: log.id_autor, // Asegúrate de que este campo existe en la respuesta
                    text: log.mensaje,
                    time: new Date(log.time).toLocaleTimeString(),
                }));
                setMessages(fetchedLogs);
            } catch (error) {
                console.log(error);
            }
        };
    
        socket.onmessage = async (event) => {
            if (event.data === "MENSAJE") {
                try {
                    const response = await axios.get(`/gamelist/${gameId}/chat`);
                    const fetchedLogs: Message[] = response.data.map((log: any) => ({
                    id: log.id_mensaje,
                    name: log.autor,
                    id_autor: log.id_autor,
                    text: log.mensaje,
                    time: new Date(log.time).toLocaleTimeString(),
                    }));
                    setMessages(fetchedLogs);
                } catch (error) {
                    console.log(error);
                }
            }
        };
    
        return () => {
            socket.close();
        };
    }, []);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.trim() !== '') {
            try {
                axios.post(`/gamelist/mensaje/${gameId}/${playerId}/${message.trim()}`);
            } catch (error) {
                console.log(error);
            }
            setMessage(''); // Limpia el input
        }
    };

    return (
        <div>
            <div className="chat-container" onClick={toggleChat} data-testid="toggle-chat">
                <FontAwesomeIcon icon={faComments} />
            </div>
            <div ref={chatRef} className={`chat-interface ${isOpen ? 'open' : ''}`}>
                <div className="close-btn" onClick={closeChat} data-testid="close-button">
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h1>CHAT</h1>
                <div className="messages-container">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.id_autor == Number(playerId) ? 'my-message' : 'other-message'}`}
                        >
                            <div className="message-header">
                                <span className="message-name">{msg.id_autor == Number(playerId) ? 'Yo' : msg.name}</span>
                                <span className="message-time">{msg.time}</span>
                            </div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    ))}
                </div>
                <div className="message-box">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Escribe tu mensaje..."
                        value={message}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />
                    <button className="send-button" onClick={handleSend} data-testid="send-button">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;