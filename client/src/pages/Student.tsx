import StudentBoard from "../components/StudentBoard/StudentBoard";
import StudentSidePanel from "../components/StudentBoard/StudentSidePanel/StudentSidePanel";
import SocketService from "../services/socket";

const Student = ({ socket }: { socket: SocketService; }) => {

    return (
        <section className="mainPage min-h-screen w-screen bg-slate-200 p-4 m-0 grid grid-cols-7 grid-row-1 gap-x-4">
            <StudentBoard socket={socket} />
            <StudentSidePanel socket={socket} />
        </section>
    );
};

export default Student;