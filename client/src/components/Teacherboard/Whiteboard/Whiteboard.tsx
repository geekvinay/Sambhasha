import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { Icon } from '@iconify/react';
import { ColorsEnum, PathActionEnum, penToolTip, whiteboardEvent } from "../../../utils/enums/enums";
const background = "../../../../public/back.svg";

// Icons from iconify
import MdiUndo from '@iconify-icons/mdi/undo';
import MdiRedo from '@iconify-icons/mdi/redo';
import MdiGridLarge from '@iconify-icons/mdi/grid-large';
import MdiPen from '@iconify-icons/mdi/pen';
import MdiLeadPencil from '@iconify-icons/mdi/lead-pencil';
import MdiDotsHorizontalCircleOutline from '@iconify-icons/mdi/dots-horizontal-circle-outline';
import MdiMenuLeft from '@iconify-icons/mdi/menu-left';
import MdiMenuRight from '@iconify-icons/mdi/menu-right';
import MdiContentSave from '@iconify-icons/mdi/content-save';
import MdiShieldSync from '@iconify-icons/mdi/shield-sync';
import MdiBrush from '@iconify-icons/mdi/brush';
import SocketService from "../../../services/socket";

const Whiteboard = ({ socket }: { socket: SocketService; }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasPar = useRef<HTMLCanvasElement>(null);
    const [paths, setPaths] = useState<fabric.Object[]>([]);
    const [removedPaths, setRemovedPaths] = useState<fabric.Object[]>([]);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [brushColor, setBrushColor] = useState<string>(ColorsEnum.BLACK);
    const [showGrid, setShowGrid] = useState<boolean>(false);
    const [pen, setPen] = useState({
        penType: penToolTip.PEN,
    });

    useEffect(() => {
        if (canvas) {
            if (pen.penType == penToolTip.PEN) {
                canvas.freeDrawingBrush = new fabric.BaseBrush();
            }
            else if (pen.penType == penToolTip.PENCIL) {
            }
            else if (pen.penType == penToolTip.BRUSH) {
            }
            else if (pen.penType == penToolTip.ERASER) {
            }
            else {
            }
            canvas.freeDrawingBrush.color = "#0e0e0e";
        }
    }, [pen]);

    useEffect(() => {
        if (!canvasPar.current || !canvasRef.current) return;

        const newCanvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'white',
            enableRetinaScaling: true,
            selection: true,
            isDrawingMode: true,
            defaultCursor: "pointer",
            height: canvasPar.current.clientHeight,
            width: canvasPar.current.clientWidth,
        });

        newCanvas.on('object:added', (event: any) => {
            setPaths(prevPaths => [...prevPaths, event.target]);
            console.log('socketService 1234: ', socket);
            socket?.sendWhiteboardPathToRoom({
                pen: pen.penType,
                path: event.target,
                action: PathActionEnum.WRITE,
                canvasHeight: canvasRef.current?.clientHeight,
                canvasWidth: canvasRef.current?.clientWidth,
            });
        });


        newCanvas.on('object:removed', (event: any) => {
            setRemovedPaths(prevPaths => [...prevPaths, event.target]);
        });

        newCanvas.freeDrawingBrush.width = 3;
        newCanvas.freeDrawingBrush.color = brushColor;
        setCanvas(newCanvas);

        return () => {
            newCanvas.dispose();
        };
    }, []);

    const handleColorSelection = (color: string) => {
        setBrushColor(color);
        if (canvas) {
            canvas.freeDrawingBrush.color = color;
            // setPen({...pen, color: color});
        }
    };

    const undoPath = () => {
        if (paths.length > 0 && canvas) {
            const lastPath = paths[paths.length - 1];
            console.log('lastPath: ', lastPath);
            canvas.remove(lastPath);
            socket.sendWhiteboardEventToRoom({
                event: whiteboardEvent.UNDO
            });
            setPaths(prevPaths => prevPaths.slice(0, -1));
        }
    };

    const redoPath = () => {
        if (removedPaths.length > 0 && canvas) {
            const lastRemovedPath = removedPaths[removedPaths.length - 1];
            canvas.add(lastRemovedPath);
            socket.sendWhiteboardEventToRoom({
                event: whiteboardEvent.REDO
            });
            setRemovedPaths(prevPaths => prevPaths.slice(0, -1)); 
            setPaths(prevPaths => [...prevPaths, lastRemovedPath]);
        }
    };

    const saveCanvasToImage = () => {
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL({ format: 'png' });
            link.download = 'canvas.png';
            link.click();
            link.remove();
        }
    };

    useEffect(() => {
        if (showGrid) {
            if (canvas) {
                fabric.Image.fromURL(background, () => {
                    const pattern = new fabric.Pattern({
                        source: background,
                        repeat: 'repeat',
                    });
                    canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));
                });
            }
        }
        else {
            if (canvas) {
                canvas.setBackgroundImage("", canvas.renderAll.bind(canvas));
            }
        }
    }, [showGrid]);

    return (
        <section ref={canvasPar} className="relative bg-white rounded-md h-full w-full">
            <canvas ref={canvasRef} className='rounded-md' />
            <section className="BottomControls absolute min-h-[3rem] ml-10 rounded-xl bottom-10 p-2 bg-slate-200 flex">
                <div className="bg-white mr-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiMenuLeft} className="text-gray-500 text-3xl" />
                </div>
                <div className="bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiMenuRight} className="text-gray-500 text-3xl" />
                </div>
            </section>
            <section className="ToolBar bg-slate-200 absolute min-h-[3rem] px-[2rem] bottom-8 left-1/2 translate-x-[-50%] shadow-md p-4 rounded-full min-w-[50%] self-center place-self-center flex justify-evenly items-center">
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiUndo} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => redoPath()}>
                    <Icon icon={MdiRedo} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => setShowGrid(grid => !grid)}>
                    <Icon icon={MdiGridLarge} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.PEN }); }}>
                    <Icon icon={MdiPen} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.PENCIL }); }}>
                    <Icon icon={MdiLeadPencil} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.PENCIL }); }}>
                    <Icon icon={MdiBrush} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 rounded-xl bg-white hover:shadow-sm mx-2 flex items-center space-x-2">
                    <button className="w-5 h-5 rounded-full bg-black" onClick={() => handleColorSelection(ColorsEnum.BLACK)}></button>
                    <button className="w-5 h-5 rounded-full bg-blue-500" onClick={() => handleColorSelection(ColorsEnum.BLUE)}></button>
                    <button className="w-5 h-5 rounded-full bg-red-500" onClick={() => handleColorSelection(ColorsEnum.RED)}></button>
                </div>
                <div className="pl-2 rounded-xl cursor-pointer">
                    <Icon icon={MdiDotsHorizontalCircleOutline} className="text-gray-400 text-2xl" />
                </div>
            </section>
            <section className="BottomControls absolute min-h-[3rem] right-10 rounded-xl bottom-10 p-2 bg-slate-200 flex">
                <div className="bg-white hover:shadow-sm rounded-xl p-1 mr-2 cursor-pointer" onClick={() => saveCanvasToImage()}>
                    <Icon icon={MdiContentSave} className="text-gray-500 text-2xl" />
                </div>
                <div className="bg-white hover:shadow-sm rounded-xl p-1 cursor-pointer" >
                    <Icon icon={MdiShieldSync} className="text-gray-500 text-2xl" />
                </div>
            </section>
        </section>
    );
};

export default Whiteboard;
