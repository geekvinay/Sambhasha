// import TeacherPanel from "../components/TeacherPanel";
import TeacherBoard from "../components/Teacherboard/TeacherBoard";
import TeacherSidePanel from "../components/Teacherboard/TeacherSidePanel/TeacherSidePanel";
import SocketService from "../services/socket";

const Teacher = ({ socket }: { socket: SocketService; }) => {

    return (
        <section className="mainPage min-h-screen w-screen bg-slate-200 p-4 m-0 grid grid-cols-11 grid-row-1 gap-x-4">
            <TeacherBoard socket={socket} />
            <TeacherSidePanel socket={socket}/>
        </section>
    );
};

export default Teacher;