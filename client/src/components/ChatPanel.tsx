import { useState } from 'react';
import SocketSerivce from '../services/socket';

const ChatPanel = ({ socket }: { socket: SocketSerivce; }) => {
    const [messages, setMessages]: any = useState([{
        user: 'other',
        text: 'Welcome to the class!!!!'
    }]);
    const [inputValue, setInputValue]: any = useState('');
    socket.socket.on("receive_inbox_mess", (payload: any) => {
        console.log('messages: ', messages);
        setMessages([...messages, { user: 'other', text: payload.mess }]);
    });

    const handleMessageSubmit = (e: any) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            setMessages([...messages, { user: 'user', text: inputValue }]);
            setInputValue('');
        }

        socket.sendInboxMess({
            mess: inputValue,
        });
    };

    return (
        <div className="h-full flex flex-col justify-between p-4">
            <div className="flex flex-col flex-grow bg-gray-200 rounded-md justify-end overflow-y-scroll px-4 pb-4">
                {messages.map((message: any, index: any) => (
                    <div key={index} className={`message-container flex ${message.user === 'user' ? 'sent justify-end' : 'received justify-start'}`}>
                        <div className={`message my-2 rounded-md px-4 py-1 w-fit max-w-[80%] ${message.user === 'user' ? 'bg-blue-500 text-white  rounded-br-none' : 'bg-green-600 text-white rounded-bl-none'}`}>
                            {message.text}
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
