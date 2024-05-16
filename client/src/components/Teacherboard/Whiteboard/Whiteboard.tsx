import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import Tesseract from "tesseract.js";
import { Icon } from '@iconify/react';
import { ColorsEnum, PathActionEnum, penToolTip, whiteboardEvent } from "../../../utils/enums/enums";
import SocketService from "../../../services/socket";
import { useScreenShare, useHMSActions } from "@100mslive/react-sdk";
// import { PageMetaData, SlidesMetaData } from "../../../common/types/whiteboard.interface";

// Icons from iconify
import MdiUndo from '@iconify-icons/mdi/undo';
import MdiRedo from '@iconify-icons/mdi/redo';
import MdiPen from '@iconify-icons/mdi/pen';
import MdiDotsHorizontalCircleOutline from '@iconify-icons/mdi/dots-horizontal-circle-outline';
import MdiMenuLeft from '@iconify-icons/mdi/menu-left';
import MdiMenuRight from '@iconify-icons/mdi/menu-right';
import MdiContentSave from '@iconify-icons/mdi/content-save';
import MdiShieldSync from '@iconify-icons/mdi/shield-sync';
import MdiMonitorShare from '@iconify-icons/mdi/monitor-share';
import MdiMonitorOff from '@iconify-icons/mdi/monitor-off';
import MdiShape from '@iconify-icons/mdi/shape';
import MdiCursorDefault from '@iconify-icons/mdi/cursor-default';
import MdiEraser from '@iconify-icons/mdi/eraser';
import MdiCheckboxBlankCircleOutline from '@iconify-icons/mdi/checkbox-blank-circle-outline';
import MdiCropSquare from '@iconify-icons/mdi/crop-square';

const Whiteboard = ({ socket }: { socket: SocketService; }) => {
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const { amIScreenSharing, screenShareVideoTrackId } = useScreenShare();
    console.log('amIScreenSharing: ', amIScreenSharing);
    const [menuState, setMenuState] = useState(false);
    const hmsActions = useHMSActions();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasPar = useRef<HTMLCanvasElement>(null);
    const [paths, setPaths] = useState<fabric.Object[]>([]);
    const [removedPaths, setRemovedPaths] = useState<fabric.Object[]>([]);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [brushColor, setBrushColor] = useState<string>(ColorsEnum.BLACK);
    const [showShapesPanel, setshowShapesPanel] = useState<boolean>(false);
    const [pen, setPen] = useState({ penType: penToolTip.PEN, });

    useEffect(() => {
        if (canvas) {
            if (pen.penType === penToolTip.PEN || pen.penType === penToolTip.BRUSH || pen.penType === penToolTip.ERASER) {
                canvas.isDrawingMode = true;
            } else if (pen.penType === penToolTip.POINTER) {
                canvas.isDrawingMode = false;
            }

            if (pen.penType === penToolTip.PEN || pen.penType === penToolTip.BRUSH) {
                // Add object added event listener
                canvas.on('object:added', handleObjectAdded);
            } else {
                // Remove object added event listener
                canvas.off('object:added', handleObjectAdded);
            }

            // Set brush properties
            setBrushProperties(canvas, brushColor);

            // Set eraser properties
            setEraserProperties(canvas);
        }
    }, [pen]);

    const handleObjectAdded = (event: any) => {
        setPaths(prevPaths => [...prevPaths, event.target]);
        // performOCR(event.target);
        socket?.sendWhiteboardPathToRoom({
            pen: pen.penType,
            path: event.target,
            action: PathActionEnum.WRITE,
            canvasHeight: canvasRef.current?.clientHeight,
            canvasWidth: canvasRef.current?.clientWidth,
        });
    };

    const setBrushProperties = (canvas: fabric.Canvas, color: string) => {
        if (pen.penType === penToolTip.PEN || pen.penType === penToolTip.BRUSH) {
            canvas.freeDrawingBrush.width = 3;
            canvas.freeDrawingBrush.color = color;
        }
    };
    const setEraserProperties = (canvas: fabric.Canvas) => {
        if (pen.penType === penToolTip.ERASER) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = "#ffffff";
            canvas.freeDrawingBrush.width = 10;
        }
    };



    useEffect(() => {
        toggleScreenShare();
    }, [isScreenSharing]);

    const addShape = (shapeType: string) => {
        if (!canvas) return;

        let shape: fabric.Object | null = null;

        switch (shapeType) {
            case 'rectangle':
                shape = new fabric.Rect({
                    width: 100,
                    height: 100,
                    fill: 'transparent',
                    stroke: brushColor,
                    strokeWidth: 2,
                    left: 10,
                    top: 10,
                    selectable: true,
                    hasControls: true,
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    radius: 50,
                    fill: 'transparent',
                    stroke: brushColor,
                    strokeWidth: 2,
                    left: 10,
                    top: 10,
                    selectable: true,
                    hasControls: true
                });
                break;
            // Add more shapes as needed
            default:
                break;
        }

        if (shape) {
            canvas.add(shape);
            setPaths(prevPaths => [...prevPaths, shape]);
        }
    };

    useEffect(() => {
        // Run after the component is mounted
        if (!canvasPar.current || !canvasRef.current) return;
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'white',
            enableRetinaScaling: true,
            isDrawingMode: true,
            defaultCursor: "pointer",
            height: canvasPar.current.clientHeight,
            width: canvasPar.current.clientWidth,
        });

        // Object added event listener and handler
        newCanvas.on('object:added', (event: any) => {
            setPaths(prevPaths => [...prevPaths, event.target]);
            // performOCR(event.target);
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

    const toggleMenuState = async () => {
        setMenuState(menuState => !menuState);
    };
    const toggleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                await hmsActions.setScreenShareEnabled(true, {
                    videoOnly: true
                });
            }
            else {
                await hmsActions.setScreenShareEnabled(false);
            }
        } catch (error) {
            console.log('error occured while sharing screen : ', error);
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

    // const performOCR = async (lastPath: fabric.Path) => {
    //     const tempCanvas = document.createElement('canvas');
    //     tempCanvas.getContext('2d');
    //     tempCanvas.width = canvasRef.current?.clientHeight || 100;
    //     tempCanvas.height = canvasRef.current?.clientWidth || 100;
    //     const tempFabricCanvas = new fabric.Canvas(tempCanvas, {
    //         height: canvasRef.current?.clientHeight,
    //         width: canvasRef.current?.clientWidth
    //     });
    //     tempFabricCanvas.add(lastPath);
    //     tempFabricCanvas.renderAll();

    //     // Convert the canvas to an image data URL
    //     const imageDataURL = tempCanvas.toDataURL();
    //     console.log('imageDataURL: ', imageDataURL);

    //     Tesseract.recognize(imageDataURL, 'eng', {
    //         logger: m => console.log(m)
    //     })
    //         .then(({ data: { text } }) => {
    //             console.log("Recognized Text:", text);
    //             replacePathWithText(text);
    //         })
    //         .catch(error => {
    //             console.error("Error performing OCR:", error);
    //         });
    // };

    // const replacePathWithText = (text: string) => {
    //     if (canvas && paths.length > 0) {
    //         const lastPath = paths[paths.length - 1];
    //         const textObject = new fabric.Textbox(text, {
    //             left: lastPath.left,
    //             top: (lastPath.top || 10) + (lastPath.height || 10) + 10,
    //             width: lastPath.width,
    //             fontSize: 14,
    //             fontFamily: 'Arial',
    //             fill: 'black',
    //             editable: false,
    //         });
    //         canvas.remove(lastPath);
    //         canvas.add(textObject);
    //         setPaths(prevPaths => prevPaths.slice(0, -1));
    //     }
    // };

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
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.POINTER }); }}>
                    <Icon icon={MdiCursorDefault} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.PEN }); }}>
                    <Icon icon={MdiPen} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => { setPen({ ...pen, penType: penToolTip.ERASER }); }}>
                    <Icon icon={MdiEraser} className="text-gray-500 text-2xl" />
                </div>
                <div className="relative p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => setshowShapesPanel(curr_state => !curr_state)}>
                    <article className={`absolute top-0 translate-y-[-140%] translate-x-[50%] rounded-lg right-0 min-h-[2rem] min-w-[5rem] bg-slate-200 menu-item flex justify-start p-4 list-none transition-opacity duration-150 ${showShapesPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => addShape('rectangle')}>
                            <Icon icon={MdiCropSquare} className="text-gray-500 text-xl" />
                        </button>
                        <button className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => addShape('circle')}>
                            <Icon icon={MdiCheckboxBlankCircleOutline} className="text-gray-500 text-xl" />
                        </button>
                    </article>
                    <Icon icon={MdiShape} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 rounded-xl bg-white hover:shadow-sm mx-2 flex items-center space-x-2">
                    <button className="w-5 h-5 rounded-full bg-black" onClick={() => handleColorSelection(ColorsEnum.BLACK)}></button>
                    <button className="w-5 h-5 rounded-full bg-blue-500" onClick={() => handleColorSelection(ColorsEnum.BLUE)}></button>
                    <button className="w-5 h-5 rounded-full bg-red-500" onClick={() => handleColorSelection(ColorsEnum.RED)}></button>
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiUndo} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer" onClick={() => redoPath()}>
                    <Icon icon={MdiRedo} className="text-gray-500 text-2xl" />
                </div>
                <div className="pl-2 rounded-xl cursor-pointer">
                    <Icon icon={MdiDotsHorizontalCircleOutline} className="text-gray-400 text-2xl" onClick={toggleMenuState} />
                    <article className={`absolute top-0 translate-y-[-120%] rounded-lg right-0 min-h-[2rem] min-w-[10rem] bg-slate-200 menu-item flex flex-col justify-start p-4 list-none transition-opacity duration-150 ${menuState ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <li className="py-1 flex items-center">
                            {!isScreenSharing ? (
                                <div className="flex hover:bg-white hover:cursor-pointer px-4 py-1 rounded-md justify-start items-center h-fit w-full" onClick={() => { setIsScreenSharing(prev => !prev); }}>
                                    <Icon icon={MdiMonitorShare} className="text-gray-500 text-xl" />
                                    <span className="px-2">Share Screen</span>
                                </div>
                            ) : (
                                <div className="flex hover:bg-white hover:cursor-pointer px-4 py-1 rounded-md justify-start items-center h-fit w-full" onClick={() => { setIsScreenSharing(prev => !prev); }}>
                                    <Icon icon={MdiMonitorOff} className="text-gray-500 text-xl" />
                                    <span className="px-2">Stop Share Screen</span>
                                </div>
                            )}
                        </li>
                        <li className="flex hover:bg-white hover:cursor-pointer px-4 py-1 rounded-md justify-start items-center h-fit w-full">
                            <Icon icon={MdiContentSave} className="text-gray-500 text-xl" />
                            <span className="px-3">Download Notes</span>
                        </li>
                        <li className="flex hover:bg-white hover:cursor-pointer px-4 py-1 rounded-md justify-start items-center h-fit w-full">
                            <Icon icon={MdiContentSave} className="text-gray-500 text-xl" />
                            <span className="px-3">Change Background</span>
                        </li>
                    </article>
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
