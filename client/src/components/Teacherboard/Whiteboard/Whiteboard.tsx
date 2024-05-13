import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import Tesseract from "tesseract.js";
import { Icon } from '@iconify/react';
import { ColorsEnum, PathActionEnum, penToolTip, whiteboardEvent } from "../../../utils/enums/enums";
import SocketService from "../../../services/socket";
// import { PageMetaData, SlidesMetaData } from "../../../common/types/whiteboard.interface";

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

const Whiteboard = ({ socket }: { socket: SocketService; }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasPar = useRef<HTMLCanvasElement>(null);
    const [paths, setPaths] = useState<fabric.Object[]>([]);
    const [removedPaths, setRemovedPaths] = useState<fabric.Object[]>([]);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [brushColor, setBrushColor] = useState<string>(ColorsEnum.BLACK);
    const [showGrid, setShowGrid] = useState<boolean>(false);
    const [pen, setPen] = useState({ penType: penToolTip.PEN, });

    useEffect(() => {
        if (canvas) {
            if (pen.penType == penToolTip.PEN) {
                canvas.freeDrawingBrush = new fabric.BaseBrush();
            } else if (pen.penType == penToolTip.PENCIL) {
            } else if (pen.penType == penToolTip.BRUSH) {
            } else if (pen.penType == penToolTip.ERASER) {
            } else {
            }
            canvas.freeDrawingBrush.color = "#0e0e0e";
        }
    }, [pen]);

    useEffect(() => {
        // Run after the component is mounted
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

        // Object added event listener and handler
        newCanvas.on('object:added', (event: any) => {
            setPaths(prevPaths => [...prevPaths, event.target]);
            performOCR(event.target);
            console.log('socketService 1234: ', socket);
            socket?.sendWhiteboardPathToRoom({
                pen: pen.penType,
                path: event.target,
                action: PathActionEnum.WRITE,
                canvasHeight: canvasRef.current?.clientHeight,
                canvasWidth: canvasRef.current?.clientWidth,
            });
        });

        // Object Removed Event listener and handler
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
            socket.sendWhiteboardEventToRoom({ event: whiteboardEvent.UNDO });
            setPaths(prevPaths => prevPaths.slice(0, -1));
        }
    };

    const redoPath = () => {
        if (removedPaths.length > 0 && canvas) {
            const lastRemovedPath = removedPaths[removedPaths.length - 1];
            canvas.add(lastRemovedPath);
            socket.sendWhiteboardEventToRoom({ event: whiteboardEvent.REDO });
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
        } else {
            if (canvas) {
                canvas.setBackgroundImage("", canvas.renderAll.bind(canvas));
            }
        }
    }, [showGrid]);

    const performOCR = async (lastPath: fabric.Path) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.getContext('2d');
        tempCanvas.width = canvasRef.current?.clientHeight || 100;
        tempCanvas.height = canvasRef.current?.clientWidth || 100;
        const tempFabricCanvas = new fabric.Canvas(tempCanvas, {
            height: canvasRef.current?.clientHeight,
            width: canvasRef.current?.clientWidth
        });
        tempFabricCanvas.add(lastPath);
        tempFabricCanvas.renderAll();

        // Convert the canvas to an image data URL
        const imageDataURL = tempCanvas.toDataURL();
        console.log('imageDataURL: ', imageDataURL);

        Tesseract.recognize(imageDataURL, 'eng', {
            logger: m => console.log(m)
        })
        .then(({ data: { text } }) => {
            console.log("Recognized Text:", text);
            replacePathWithText(text);
        })
        .catch(error => {
            console.error("Error performing OCR:", error);
        });
    };

    const replacePathWithText = (text: string) => {
        if (canvas && paths.length > 0) {
            const lastPath = paths[paths.length - 1];
            const textObject = new fabric.Textbox(text, {
                left: lastPath.left,
                top: (lastPath.top || 10) + (lastPath.height || 10) + 10,
                width: lastPath.width,
                fontSize: 14,
                fontFamily: 'Arial',
                fill: 'black',
                editable: false,
            });
            canvas.remove(lastPath);
            canvas.add(textObject);
            setPaths(prevPaths => prevPaths.slice(0, -1));
        }
    };

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
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.BRUSH }); }}>
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
