import { useState, useEffect } from 'react';
import SocketService from '../services/socket';

const ChatPanel = ({ socket, messages, setMessages }: { socket: SocketService; messages: any, setMessages: React.Dispatch<React.SetStateAction<{ user: string; mess: any; }[]>>; }) => {
    const [inputValue, setInputValue] = useState('');

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('inputValue: ', inputValue);
        if (inputValue.trim() !== '') {
            setMessages(prevMessages => {
                const currMessList = [...prevMessages, { user: 'user', mess: inputValue }];
                localStorage.setItem('session-messages', JSON.stringify(currMessList));
                return currMessList;
            });
            setInputValue('');
            socket.sendInboxMessageToRoom(inputValue);
        }
    };

    return (
        <div className="h-full flex flex-col justify-between bg-white">
            <div className="max-height-full h-full flex flex-col overflow-scroll bg-slate-200 rounded-md justify-end box-border px-2 pb-2" >
                {messages.map((message: any, index: number) => (
                    <div key={index} className={`message-container flex ${message.user === 'user' ? 'sent justify-end' : 'received justify-start'}`}>
                        <div className={`message my-2 rounded-md px-4 py-1 max-w-[80%] ${message.user === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-green-600 text-white rounded-bl-none'}`}>
                            {message.mess}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleMessageSubmit} className="flex items-center pt-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;
