import { useEffect, useState } from 'react';
import SocketService from '../../../services/socket';

const TeacherPollPanel = ({ socket }: { socket: SocketService; }) => {
    const [question, setQuestion] = useState('');
    const [isPollCreated, setIsPollCreated] = useState(false);
    const [options, setOptions] = useState([
        { text: '', votes: 0 },
        { text: '', votes: 0 },
        { text: '', votes: 0 },
        { text: '', votes: 0 },
    ]);

    const handleCreatePoll = () => {
        socket.sendCreatePoll({ question, options });
        setIsPollCreated(true);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index].text = value;
        setOptions(updatedOptions);
    };

    useEffect(() => {
        socket.on('receive_answer_poll_event', (data) => {
            const { option } = data;
            const updatedOptions = [...options];
            updatedOptions[option].votes += 1;
            setOptions(updatedOptions);
        });

        return () => {
            socket.socket && socket.socket.off('receive_answer_poll_event');
        };
    }, [socket, options]);

    const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="poll-panel h-full w-full overflow-scroll p-2 bg-slate-200 rounded-lg font-medium text-lg">
            {isPollCreated ? (
                <div className="bg-white rounded-md p-4 h-full">
                    <h2 className="text-xl font-bold text-center my-4">Poll Submissions</h2>
                    <div className='p-2'>
                        {options.map((option, index) => (
                            <div key={index} className="flex flex-col items-center mb-2">
                                <div className='option px-4 py-2 bg-white rounded-md text-gray-400 w-full flex justify-between'>
                                    <span>{option.text || `Option ${index + 1}`}</span>
                                    <span>{totalVotes !== 0 ? `${((option.votes / totalVotes) * 100).toFixed(2)}%` : '0%'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='bg-white rounded-md p-4 h-full'>
                    <h2 className="text-xl font-bold text-center">Create a Poll</h2>
                    <div className="p-4 rounded-lg">
                        <input
                            type="text"
                            placeholder="Enter your question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 border rounded-md mb-4 text-base"
                        />
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="w-full px-3 py-2 border-none rounded-md text-base"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleCreatePoll}
                            className="bg-slate-700 text-white px-6 py-3 rounded-md hover:bg-slate-800 text-base w-full"
                        >
                            Create Poll
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPollPanel;