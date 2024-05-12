import { useState } from "react";
import { userRoleEnum } from "../utils/enums/enums";
import { useNavigate } from "react-router-dom";
import classImage from "../assets/background.webp";
import logoImage from "../assets/logo-1.jpg";

const Welcome = () => {
    const [userRole, setUserRole] = useState(userRoleEnum.STUDENT);
    const [inputs, setInputs] = useState({
        username: "",
        classCode: "",
    });
    const navigate = useNavigate();
    const handleRoleChange = (e: any) => {
        setUserRole(e.target.value);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const handleFormSubmit = (event:  any) => {
        event.preventDefault();
        localStorage.setItem("session-details", JSON.stringify(inputs));
        if (userRole === userRoleEnum.TEACHER) {
            navigate(`/teacher`);
        } else {
            navigate(`/student`);
        }
    };

    return (
        <section className="parentPage h-screen w-screen bg-gray-300 grid grid-cols-2 grid-rows-1">
            <section className="right-section bg-red-200 h-full w-full ">
                <img src={classImage} alt="" className="h-full w-full object-cover brightness-[70%]" />
            </section>
            <section className="left-section w-full h-full flex flex-col items-center justify-center">
                <section className="logoImage w-[70%] h-[20%] bg-white rounded-xl my-8 overflow-hidden">
                    <img src={logoImage} alt="" className="h-full w-full object-cover" />
                </section>
                <section className="formWrapper min-w-[70%] py-[4rem] px-[4rem] rounded-xl bg-white flex flex-col justify-center">
                    <form action="/" className="relative flex flex-col items-start" onSubmit={handleFormSubmit}>
                        <label htmlFor="username" className="absolute transform -translate-y-[120%] text-slate-700 mb-2 text-2xl font-bold">Welcome to the class!</label>
                        <select id="role" value={userRole} className="px-4 py-2 my-2 w-[25vw] bg-gray-200 shadow-sm rounded-md" onChange={handleRoleChange}>
                            <option value={userRoleEnum.TEACHER}>Teacher</option>
                            <option value={userRoleEnum.STUDENT}>Student</option>
                        </select>
                        <input type="text" name="username" id="username" placeholder="Username" className="px-4 py-2 my-2 w-[25vw] bg-gray-200 shadow-sm rounded-md" onChange={handleInputChange} />
                        <input type="text" name="classCode" id="classCode" placeholder="Class ID" className="px-4 py-2 my-2 w-[25vw] bg-gray-200 shadow-sm rounded-md" onChange={handleInputChange} />
                        <button type="submit" name="submit" id="submit" className="px-4 py-2 my-2 bg-blue-500 text-white font-medium w-[25vw] shadow-sm rounded-md">
                            Submit
                        </button>
                    </form>
                    {userRole === userRoleEnum.TEACHER && (
                        <p className="text-blue-500 cursor-pointer underline" onClick={() => navigate(`/create-class`)}>
                            Click here to create new class!!
                        </p>
                    )}
                </section>
            </section>
        </section>
    );
};

export default Welcome;
