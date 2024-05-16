import { useEffect, useState } from "react";
import SocketService from "../../../services/socket";
import { ControlPanelStateEnum } from "../../../utils/enums/enums";
import VideoPanel from "../VideoPanel/VideoPanel";
import ChatPanel from "../../ChatPanel";
import StudentPollPanel from "../StudentPollPanel/StudentPollPanel";
import PeoplePanel from "../../PeoplePanel";

const StudentSidePanel = ({ socket }: { socket: SocketService; }) => {
  const [controlPanelState, setControlPanelState] = useState<ControlPanelStateEnum>(ControlPanelStateEnum.CHAT); // Set default state to CHAT
  const [messages, setMessages] = useState([{ user: 'other', mess: 'Welcome to the class!!!!' }]);
  const [question, setQuestion] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [answeredOption, setansweredOption] = useState<any>(null);
  const [options, setOptions] = useState([
    { text: '', votes: 0 },
    { text: '', votes: 0 },
    { text: '', votes: 0 },
    { text: '', votes: 0 },
  ]);

  useEffect(() => {
    socket.on('receive_create_poll_event', (data) => {
      setIsActive(true);
      console.log('data: ', data);
      const { question, options } = data;
      setQuestion(question);
      setOptions(options);
    });

    return () => {
      socket.socket && socket.socket.off('receive_create_poll_event');
    };
  }, [socket]);

  useEffect(() => {
    const receiveInboxMess = (payload: any) => {
      console.log('payload: ', payload);
      setMessages(prevMessages => [...prevMessages, { user: 'other', mess: payload }]);
    };

    if (socket.socket) {
      socket.on("receive_inbox_mess", receiveInboxMess);
      return () => {
        socket.socket && socket.socket.off("receive_inbox_mess", receiveInboxMess);
      };
    }
  }, []);
  const handleTabClick = (state: ControlPanelStateEnum) => {
    setControlPanelState(state);
  };

  return (
    <section className="StudentSidePanel col-span-2 rounded-md flex flex-col justify-start">
      <VideoPanel isTeacher={false} socket={socket}/>
      <section className="SideControlPanel bg-white mt-2 rounded-md p-2 w-full flex flex-col h-full">
        <nav className="tabs-menu flex justify-between bg-slate-200 rounded-md border-[0.3rem] border-slate-200 overflow-hidden box-content">
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.CHAT ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.CHAT)}>Chat</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.POLLS ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.POLLS)}>Polls</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.PEOPLE ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.PEOPLE)}>People</div>
        </nav>
        <div className="content h-full flex-grow pt-2">
          {controlPanelState === ControlPanelStateEnum.POLLS && (
            <StudentPollPanel socket={socket} question={question} isActive={isActive} answeredOption={answeredOption} options={options} setansweredOption={setansweredOption} />
          )}
          {controlPanelState === ControlPanelStateEnum.PEOPLE && (
            <PeoplePanel socket={socket} isTeacher={false} />
          )}
          {controlPanelState === ControlPanelStateEnum.CHAT && (
            <section className="h-full w-full bg-slate-200 rounded-md flex-grow">
              <ChatPanel socket={socket} messages={messages} setMessages={setMessages} />
            </section>
          )}
        </div>
      </section>
    </section>
  );
};

export default StudentSidePanel;
