import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import SocketSerivce from '../services/socket';
import TeacherVideo from './TeacherVideo';

const TeacherBoard = ({ socket }: { socket: SocketSerivce; }) => {
    socket.socket.on("receive_message", (payload) => {
        console.log('payload: ', payload);
    });

    let myCanvas: fabric.Canvas;
    const canvasRef = useRef() as any;
    const canvasPar = useRef() as any;
    useEffect(() => {
        if (!canvasRef) return;
        if (!canvasPar) return;

        myCanvas = new fabric.Canvas(
            canvasRef.current,
            {
                isDrawingMode: true,
                height: canvasPar.current.clientHeight,
                width: canvasPar.current.clientWidth,
            }
        );
        myCanvas.freeDrawingBrush.width = 3;
        myCanvas.freeDrawingBrush.color = '#0e0e0e';

        myCanvas.on('object:added', (event: any) => {
            const modifiedObject = event.target;
            const left = modifiedObject.left;
            const top = modifiedObject.top;
            const path = modifiedObject.path;
            socket.sendWhiteboardPath({
                path: path,
                originalCanvasWidth: myCanvas.width,
                originalCanvasHeight: myCanvas.height,
                left,
                top
            });
        });
        myCanvas.on('path:created', (event: any) => {
            console.log('event: ', event.path.path);
        });

        return () => { };
    }, []);
    return (
        <section className='relative col-span-5 bg-white rounded-md overflow-hidden' ref={canvasPar}>
            <TeacherVideo />
            <canvas ref={canvasRef} className='h-full w-full' />
        </section>
    );
};

export default TeacherBoard;