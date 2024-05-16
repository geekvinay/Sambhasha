import SocketService from '../../../services/socket';

const StudentPollPanel = ({ socket, question, isActive, answeredOption, options, setansweredOption }: { socket: SocketService; question: any; isActive: any; answeredOption: any; options: any; setansweredOption: any; }) => {
    const handleAnswerPoll = (optionIndex: number) => {
        if (answeredOption == null) {
            socket.sendAnswerPoll({ option: optionIndex });
            setansweredOption(optionIndex);
        } else {
            alert("You have already answered");
        }
    };

    return (
        <div className="poll-panel h-full w-full bg-white p-6 rounded-lg text-gray-900">
            <h2 className="text-2xl font-bold mb-4 text-center">Student Poll Panel</h2>
            {isActive ?
                <div className="mb-4">
                    <p className="text-lg font-semibold mb-2 text-center">{question || "No description !!!"}</p>
                    {options.map((option: any, index: any) => (
                        <div key={index} className="flex items-center mb-4">
                            <button
                                onClick={() => handleAnswerPoll(index)}
                                className={`${answeredOption == index ? "bg-gray-500" : "bg-gray-300"} text-white px-6 py-3 rounded-md hover:bg-gray-500 text-lg w-full`}
                            >
                                {option.text || `Option ${index + 1}`}
                            </button>
                        </div>
                    ))}
                </div>
                : <div className='w-full text-xl text-center text-red-600 font-semibold'>
                    No poll is active!!!
                </div>
            }
        </div>
    );
};

export default StudentPollPanel;