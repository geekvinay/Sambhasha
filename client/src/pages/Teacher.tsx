import SocketSerivce from "../services/socket";
import TeacherBoard from "../components/TeacherBoard";

const Teacher = () => {
    // const socketService = new SocketSerivce("");
    const socketService =new SocketSerivce("room1244");

    return (
        <section className="mainPage min-h-screen w-screen bg-slate-200 p-4 m-0 grid grid-cols-7 grid-row-1 gap-x-4">
            <TeacherBoard socket={socketService} />
        </section>
    );
};

export default Teacher;