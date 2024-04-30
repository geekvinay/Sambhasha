import UndoIcon from '@mui/icons-material/Undo';
const ToolBar = () => {
    return (
        <div className="absolute z-50 min-h-[10vh] min-w-[50%] rounded-[50rem] bottom-[2rem] left-[50%] translate-x-[-50%] bg-slate-200 p-2 flex items-center justify-around">
            <IconItem><UndoIcon /></IconItem>
        </div>
    );
};

const IconItem = ({ children }: any) => {
    return (
        <div className='p-2 rounded-[50rem] bg-white text-gray-600 hover:cursor-pointer'>
            {children}
        </div>
    );
};

export default ToolBar;
