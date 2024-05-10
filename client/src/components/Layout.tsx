import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Teacher from "../pages/Teacher";
import 'normalize.css';
import Student from "../pages/Student";
import Welcome from "../pages/Welcome";
import SocketService from "../services/socket";
import ClassCreate from "../pages/ClassCreate";
const socketService = new SocketService();

const Layout = () => {
    const presentPath = useLocation();
    const [path, setPath] = useState({});
    const [socket, setSocket] = useState<SocketService>(socketService);
    socketService.socket?.on("sendWhiteboard", (data): any => {
        console.log("data: ", data);
    });

    useEffect(() => {
        setPath(presentPath);
        setSocket(socketService);
    }, [path, presentPath]);

    if (presentPath.pathname.includes("teacher")) {
        return <Teacher socket={socket} />;
    } else if (presentPath.pathname.includes("student")) {
        return <Student socket={socket} />;
    }
    else if (presentPath.pathname.includes("create-class")) {
        return <ClassCreate />;
    }
    else {
        return <Welcome />;
    }

};

export default Layout;