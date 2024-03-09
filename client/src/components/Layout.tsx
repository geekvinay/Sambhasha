import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Teacher from "../pages/Teacher";
import 'normalize.css';
import Student from "../pages/Student";

const Layout = () => {
    const presentPath = useLocation();
    const [path, setPath] = useState({});

    useEffect(() => {
        setPath(presentPath);
    }, [path, presentPath]);

    if (presentPath.pathname.includes("teacher"))
        return <Teacher />;
    else if (presentPath.pathname.includes("student"))
        return <Student />;
    else
        return <Teacher/>;
};

export default Layout;