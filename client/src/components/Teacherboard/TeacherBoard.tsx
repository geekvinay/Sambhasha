import SocketSerivce from "../../services/socket";
import Whiteboard from "./Whiteboard/Whiteboard";

const TeacherBoard = ({ socketService }: { socketService: SocketSerivce; }) => {
    console.log('socketService: ', socketService);

    return (
        <section className="TeacherBoard col-span-5">
            <Whiteboard />
        </section>
    );
};

export default TeacherBoard;