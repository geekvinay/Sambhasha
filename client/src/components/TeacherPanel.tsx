import SocketSerivce from "../services/socket";
import ChatPanel from "./ChatPanel";

const TeacherPanel = ({socket}: {socket: SocketSerivce}) => {
  return (
    <section className='col-span-2 h-full rounded-md flex flex-col justify-between'>
      <section className="controls w-full py-2 bg-white h-[8vh] rounded-md px-2 flex justify-between">
        <button className="px-4 py-1 rounded-lg text-lg text-white bg-blue-600">Record</button>
        <button className="px-4 py-1 rounded-lg text-lg text-white bg-blue-600">Attendance</button>
        <button className="px-4 py-1 rounded-lg text-lg text-white bg-red-600">End</button>
      </section>
      <section className="chat-room w-full rounded-md h-[85vh] bg-white">
        <ChatPanel socket={socket}/>
      </section>
    </section>
  );
};

export default TeacherPanel;