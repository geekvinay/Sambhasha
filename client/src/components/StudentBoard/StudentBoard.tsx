import SocketSerivce from "../../services/socket";
import Whiteboard from "./Whiteboard/Whiteboard";

const StudentBoard = ({ socket }: { socket: SocketSerivce; }) => {
    return (
        <section className="StudentBoard col-span-5">
            <Whiteboard socket={socket}/>
        </section>
    );
};

export default StudentBoard;