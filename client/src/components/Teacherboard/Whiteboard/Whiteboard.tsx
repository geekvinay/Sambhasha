import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { Icon } from '@iconify/react';
import { ColorsEnum } from "../../../utils/enums/enums";

// Icons from iconify
import MdiUndo from '@iconify-icons/mdi/undo';
import MdiRedo from '@iconify-icons/mdi/redo';
import MdiGridLarge from '@iconify-icons/mdi/grid-large';
import MdiPen from '@iconify-icons/mdi/pen';
import MdiLeadPencil from '@iconify-icons/mdi/lead-pencil';
import MdiDotsHorizontalCircleOutline from '@iconify-icons/mdi/dots-horizontal-circle-outline';
import MdiMenuLeft from '@iconify-icons/mdi/menu-left';
import MdiMenuRight from '@iconify-icons/mdi/menu-right';
import MdiContentSave from '@iconify-icons/mdi/content-save'
import MdiShieldSync from '@iconify-icons/mdi/shield-sync'

const Whiteboard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasPar = useRef<HTMLCanvasElement>(null);
    const [paths, setPaths] = useState<any[]>([]);
    let canvas: fabric.Canvas;

    useEffect(() => {
        if (!canvasPar.current || !canvasRef.current) return;

        canvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'white',
            enableRetinaScaling: true,
            selection: true,
            isDrawingMode: true,
            defaultCursor: "pointer",
            height: canvasPar.current.clientHeight,
            width: canvasPar.current.clientWidth,
        });

        canvas.on('object:added', (event: any) => {
            console.log('event: ', event);
            setPaths(prevPaths => [...prevPaths, event.target.path]);
        });
        canvas.freeDrawingBrush.width = 3;

        return () => {
            if (canvas) {
                canvas.off('path:created');
            }
        };
    }, []);

    useEffect(() => {
        console.log('paths: ', paths);
    }, [paths]);

    const handleColorSelection = (color: string) => {
        console.log('color: ', color);
        if (canvas) {
            canvas.freeDrawingBrush.color = color;
        }
    };

    const undoPath = () => {
        console.log('undoPath-paths: ', paths);
        if (paths.length > 0 && canvas) {
            const lastPath = paths[paths.length - 1];
            console.log('lastPath: ', lastPath);
            console.log('canvas: ', canvas);
            canvas.remove(lastPath);
            setPaths(prevPaths => prevPaths.slice(0, -1));
        }
    };

    const redoPath = () => {
        // Logic to redo
    };

    return (
        <section ref={canvasPar} className="relative bg-green-200 rounded-md h-full w-full">
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
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiRedo} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiGridLarge} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiPen} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiPen} className="text-gray-500 text-2xl" />
                </div>
                <div className="p-2 bg-white mx-2 hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiLeadPencil} className="text-gray-500 text-2xl" />
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
                <div className="bg-white hover:shadow-sm rounded-xl p-1 mr-2 cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiContentSave} className="text-gray-500 text-2xl" />
                </div>
                <div className="bg-white hover:shadow-sm rounded-xl p-1 cursor-pointer" onClick={() => undoPath()}>
                    <Icon icon={MdiShieldSync} className="text-gray-500 text-2xl" />
                </div>
            </section>
        </section>
    );
};

export default Whiteboard;
