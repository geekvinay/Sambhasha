import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { whiteboardEvent } from "../../../utils/enums/enums";
import { Icon } from "@iconify/react/dist/iconify.js";

// Icons from iconify
import MdiContentSave from '@iconify-icons/mdi/content-save';
import MdiShieldSync from '@iconify-icons/mdi/shield-sync';
import SocketService from "../../../services/socket";

const Whiteboard = ({ socket }: { socket: SocketService; }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasParRef = useRef<HTMLCanvasElement>(null);
    const [paths, setPaths] = useState<fabric.Object[]>([]);
    const [removedPaths, setRemovedPaths] = useState<fabric.Object[]>([]);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    useEffect(() => {

    }, [removedPaths, paths]);

    useEffect(() => {
        if (!canvasRef.current || !canvasParRef.current) return;

        const newCanvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'white',
            enableRetinaScaling: true,
            selection: false,
            isDrawingMode: false,
            defaultCursor: "pointer",
            height: canvasParRef.current.clientHeight,
            width: canvasParRef.current.clientWidth,
        });

        newCanvas.on('object:added', (event: any) => {
            setPaths(prevPaths => [...prevPaths, event.target]);
        });
        newCanvas.on('object:removed', (event: any) => {
            setRemovedPaths(prevPaths => [...prevPaths, event.target]);
        });

        newCanvas.freeDrawingBrush.width = 3;
        newCanvas.freeDrawingBrush.color = "#0e0e0e";
        setCanvas(newCanvas);

        return () => {
            newCanvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (!canvas) return;

        socket?.on("receive_whiteboard_path", (data: any) => {
            // ##### TODO:  Handle scaling of paths seperately

            const path = new fabric.Path(data.path.path, {
                stroke: data.path.stroke,
                strokeWidth: data.path.strokeWidth,
                strokeLineCap: data.path.strokeLineCap,
                strokeLineJoin: data.path.strokeLineJoin,
                selectable: false,
                fill: 'transparent',
            });
            canvas.add(path);
        });

        socket.on("receive_whiteboard_event", (data: any) => {
            if (data.event == whiteboardEvent.UNDO) {
                undoPath();
            }
            else if (data.event == whiteboardEvent.REDO) {
                redoPath();
            }
        });
    }, [canvas, socket]);


    const undoPath = () => {
        setPaths(prevPaths => {
            if (prevPaths.length > 0 && canvas) {
                const lastPath = prevPaths[prevPaths.length - 1];
                canvas.remove(lastPath);
                socket.sendWhiteboardEventToRoom({
                    event: whiteboardEvent.UNDO
                });
                return prevPaths.slice(0, -1);
            }
            return prevPaths;
        });
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

    return (
        <section ref={canvasParRef} className="relative bg-white rounded-md h-full w-full">
            <canvas ref={canvasRef} className='rounded-md' />
            <section className="BottomControls absolute min-h-[3rem] right-10 rounded-xl bottom-10 p-2 bg-slate-200 flex">
                <div className="bg-white hover:shadow-sm rounded-xl p-1 mr-2 cursor-pointer" onClick={() => saveCanvasToImage()} >
                    <Icon icon={MdiContentSave} className="text-gray-500 text-2xl" />
                </div>
                <div className="bg-white hover:shadow-sm rounded-xl p-1 cursor-pointer">
                    <Icon icon={MdiShieldSync} className="text-gray-500 text-2xl" />
                </div>
            </section>
        </section>

    );
};

export default Whiteboard;
