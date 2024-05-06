import SocketService from "../../services/socket";
import Whiteboard from "./Whiteboard/Whiteboard";

const TeacherBoard = ({ socket }: { socket: SocketService; }) => {

    return (
        <section className="TeacherBoard col-span-5">
            <Whiteboard socket={socket} />
        </section>
    );
};

export default TeacherBoard;