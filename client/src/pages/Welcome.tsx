import { useState } from "react";
import { userRoleEnum } from "../utils/enums/enums";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const [userRole, setUserRole] = useState(userRoleEnum.STUDENT);
    const [inputs, setInputs] = useState({
        classId: "",
        rollNumber: ""
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
        console.log('inputs: ', inputs);
    };
    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        console.log('Submitted!');
        navigate(`/${userRole}`);
    };
    return (
        <section className="bg-gray-300 w-screen h-screen flex items-center justify-center">
            <form action="/" className="relative flex flex-col items-start" onSubmit={handleFormSubmit}>
                <label htmlFor="role" className="absolute transform -translate-y-[120%] text-slate-700 mb-2 text-2xl font-medium">Welcome to the Class!</label>
                <select id="role" value={userRole} className="px-4 py-2 my-2 w-[25vw] shadow-sm rounded-md" onChange={handleRoleChange}>
                    <option value={userRoleEnum.TEACHER}>Teacher</option>
                    <option value={userRoleEnum.STUDENT}>Student</option>
                </select>
                <input type="text" name="classId" id="classId" placeholder="RoomId" className="px-4 py-2 my-2 w-[25vw] shadow-sm rounded-md" onChange={handleInputChange} />
                <input type="text" name="rollNumber" id="rollNumber" placeholder="Roll Number" className="px-4 py-2 my-2 w-[25vw] shadow-sm rounded-md" onChange={handleInputChange} />
                <button type="submit" name="submit" id="submit" className="px-4 py-2 my-2 bg-blue-500 text-white font-medium w-[25vw] shadow-sm rounded-md">
                    Submit
                </button>
            </form>
        </section>
    );
};

export default Welcome;
