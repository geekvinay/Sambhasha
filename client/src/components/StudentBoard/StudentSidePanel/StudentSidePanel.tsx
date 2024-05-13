import { useState } from "react";
import SocketService from "../../../services/socket";
import { ControlPanelStateEnum } from "../../../utils/enums/enums";
import VideoPanel from "../VideoPanel/VideoPanel";
import ChatPanel from "../../ChatPanel";
import StudentPollPanel from "../StudentPollPanel/StudentPollPanel";

const StudentSidePanel = ({ socket }: { socket: SocketService; }) => {
  const [controlPanelState, setControlPanelState] = useState<ControlPanelStateEnum>(ControlPanelStateEnum.POLLS); // Set default state to CHAT

  const handleTabClick = (state: ControlPanelStateEnum) => {
    setControlPanelState(state);
  };

  return (
    <section className="StudentSidePanel col-span-2 rounded-md flex flex-col justify-start">
      <VideoPanel isTeacher={false} />
      <section className="SideControlPanel bg-white mt-2 rounded-md p-2 w-full flex flex-col h-full">
        <nav className="tabs-menu flex justify-between bg-slate-200 rounded-md border-[0.3rem] border-slate-200 overflow-hidden box-content">
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.CHAT ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.CHAT)}>Chat</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.POLLS ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.POLLS)}>Polls</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 tab ${controlPanelState === ControlPanelStateEnum.PEOPLE ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.PEOPLE)}>People</div>
        </nav>
        <div className="content h-full flex-grow pt-2">
          {controlPanelState === ControlPanelStateEnum.POLLS && (
            <StudentPollPanel socket={socket} />
          )}
          {controlPanelState === ControlPanelStateEnum.PEOPLE && (
            <section className="h-full w-full bg-slate-200 rounded-md flex-grow">This is People</section>
          )}
          {controlPanelState === ControlPanelStateEnum.CHAT && (
            <section className="h-full w-full bg-slate-200 rounded-md flex-grow">
              <ChatPanel socket={socket} />
            </section>
          )}
        </div>
      </section>
    </section>
  );
};

export default StudentSidePanel;
