import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Teacher from "../pages/Teacher";
import 'normalize.css';
import Student from "../pages/Student";
import Welcome from "../pages/Welcome";

const Layout = () => {
    const presentPath = useLocation();
    const [path, setPath] = useState({});

    useEffect(() => {
        setPath(presentPath);
        const pathArray = presentPath.pathname.split('/');
        const roomidIndex = pathArray.indexOf('room') + 2;
        const rollNumberIndex = roomidIndex + 1;

        if (pathArray[roomidIndex]) {
            console.log('pathArray[roomidIndex]: ', pathArray[roomidIndex]);
            console.log('pathArray[rollNumberIndex]: ', pathArray[rollNumberIndex]);
        }
    }, [path, presentPath]);

    // if (presentPath.pathname.includes("teacher"))
    //     return <Teacher />;
    // else if (presentPath.pathname.includes("student"))
    //     return <Student />;
    // else
    //     return <Welcome/>;
    if (presentPath.pathname.includes("room")) {
        if (presentPath.pathname.includes("teacher")) {
            return <Teacher />;
        } else if (presentPath.pathname.includes("student")) {
            return <Student />;
        }
    }
    else {
        return <Welcome />;
    }

};

export default Layout;