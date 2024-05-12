import SocketService from "../../../services/socket";
import VideoPanel from "../VideoPanel/VideoPanel";

const StudentSidePanel = ({ socket }: { socket: SocketService; }) => {
  console.log('socket: ', socket.socket?.id);
  return (
    <section className="StudentSidePanel col-span-2 rounded-md flex flex-col justify-start">
      <VideoPanel isTeacher={false}/>
    </section>
  );
};

export default StudentSidePanel;