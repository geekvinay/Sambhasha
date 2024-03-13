import { useEffect } from "react";
import SocketSerivce from "../services/socket";
import StudentBoard from "../components/StudentBoard";
import StudentPanel from "../components/StudentPanel";
import { useLocation } from "react-router-dom";

const Student = () => {
    // const socketService = new SocketSerivce("");
    const socketService = new SocketSerivce("room1244");
    const location = useLocation();
    const receivedData = location.state?.data;
    console.log('receivedData: ', receivedData);

    useEffect(() => {
        return () => {
            socketService.socket.disconnect();
        };
    }, [socketService]);

    return (
        <section className="mainPage min-h-screen w-screen bg-slate-200 p-4 m-0 grid grid-cols-7 grid-row-1 gap-x-4">
            <StudentBoard socket={socketService} />
            <StudentPanel socket={socketService} />
        </section>
    );
};

export default Student;