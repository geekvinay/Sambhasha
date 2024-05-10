import SocketService from "../../../services/socket";
import VideoPanel from "../VideoPanel/VideoPanel";

const TeacherSidePanel = ({ socket }: { socket: SocketService; }) => {
  console.log('socket: ', socket.connect);
  return (
    <section className="TeacherSidePanel bg-white col-span-3 rounded-md p-2 flex flex-col justify-start">
      <VideoPanel isTeacher={true}/>
    </section>
  );
};

export default TeacherSidePanel;