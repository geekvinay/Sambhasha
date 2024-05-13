import { useState } from "react";
import SocketService from "../../../services/socket";
import { ControlPanelStateEnum } from "../../../utils/enums/enums";
import VideoPanel from "../VideoPanel/VideoPanel";
import ChatPanel from "../../ChatPanel";
import PeoplePanel from "../../PeoplePanel";
import TeacherPollPanel from "../TeacherPollPanel/TeacherPollPanel";

const TeacherSidePanel = ({ socket }: { socket: SocketService; }) => {
  const [controlPanelState, setControlPanelState] = useState<ControlPanelStateEnum>(ControlPanelStateEnum.POLLS); // Set default state to CHAT
  const handleTabClick = (state: ControlPanelStateEnum) => {
    setControlPanelState(state);
  };

  return (
    <section className="TeacherSidePanel col-span-3 max-h-screen rounded-md flex flex-col justify-start box-content">
      <VideoPanel isTeacher={true} />
      <section className="SideControlPanel bg-white mt-2 rounded-md p-2 w-full flex flex-col h-full">
        <nav className="TabsMenu flex justify-between bg-slate-200 rounded-md border-[0.3rem] border-slate-200">
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 Tab ${controlPanelState === ControlPanelStateEnum.CHAT ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.CHAT)}>Chat</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 Tab ${controlPanelState === ControlPanelStateEnum.POLLS ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.POLLS)}>Polls</div>
          <div className={`w-full text-center hover:cursor-pointer font-medium py-2 Tab ${controlPanelState === ControlPanelStateEnum.PEOPLE ? 'active rounded-md shadow-md font-semibold bg-white text-gray-700' : 'text-gray-400'}`} onClick={() => handleTabClick(ControlPanelStateEnum.PEOPLE)}>People</div>
        </nav>
        <div className="Content h-full pt-2">
          {controlPanelState === ControlPanelStateEnum.CHAT ? (
            <ChatPanel socket={socket} />
          ) : controlPanelState === ControlPanelStateEnum.POLLS ? (
            <TeacherPollPanel socket={socket} />
          ) : controlPanelState === ControlPanelStateEnum.PEOPLE ? (
            // <section className=" w-full bg-slate-200 rounded-md overflow-scroll">This is People</section>
            <PeoplePanel />
          ) : (
            <section className=" w-full bg-slate-200 rounded-md overflow-scroll">
              <ChatPanel socket={socket} />
            </section>)}
        </div>
      </section>
    </section>
  );
};

export default TeacherSidePanel;
