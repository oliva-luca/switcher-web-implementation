import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './chat.css';
import axios from 'axios';

interface Message {
    id: number;
    name: string;
    time: string;
    text: string;
}

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]); // Estado para almacenar los mensajes
    const userId = localStorage.getItem('userId');
    const gameId = localStorage.getItem('gameId');

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
            try{
                axios.put(`/gamelist/${gameId}/message/${userId}`, {
                    message: message.trim(),
                });
            } catch(error){
                console.log(error);
            }
            const newMessage: Message = {
                id: messages.length + 1,
                name: 'Usuario', // Nombre hardcoded
                time: new Date().toLocaleTimeString(), // Tiempo actual
                text: message.trim(),
            };
            setMessages([...messages, newMessage]); // Añade el mensaje al estado
            setMessage(''); // Limpia el input
        }
    };

    return (
        <div>
            <div className="chat-container" onClick={toggleChat}>
                <FontAwesomeIcon icon={faComments} />
            </div>
            <div ref={chatRef} className={`chat-interface ${isOpen ? 'open' : ''}`}>
                <div className="close-btn" onClick={closeChat}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h1>CHAT</h1>
                <div className="messages-container">
                    {messages.map((msg) => (
                        <div key={msg.id} className="message">
                            <div className="message-header">
                                <span className="message-name">{msg.name}</span>
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
                    <button className="send-button" onClick={handleSend}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;