import SocketService from "../../../services/socket";
import VideoPanel from "../VideoPanel/VideoPanel";

const StudentSidePanel = ({ socket }: { socket: SocketService; }) => {
  console.log('socket: ', socket.connect);
  return (
    <section className="StudentSidePanel bg-white col-span-2 rounded-md p-2 flex flex-col justify-start">
      <VideoPanel isTeacher={false}/>
    </section>
  );
};

export default StudentSidePanel;