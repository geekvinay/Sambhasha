import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import SocketSerivce from '../services/socket';
import TeacherVideo from './TeacherVideo';
import { PathActionEnum } from '../utils/enums/enums';
import { Whiteboard } from '../services/whiteboard';
import { pathObj } from '../common/types/whiteboard.interface';
import ToolBar from './ToolBar';
import SlidePanel from './SlidePanel';

const TeacherBoard = ({ socket }: { socket: SocketSerivce; }) => {
    const canvasRef = useRef() as any;
    let myCanvas: fabric.Canvas;
    const canvasPar = useRef() as any;
    const whiteboard = new Whiteboard();

    function addToBoard(event: any) {
        console.log('event: ', event.target.path);
        const modifiedObject = event.target;
        if (modifiedObject && modifiedObject.path) {
            const data: pathObj = {
                path: modifiedObject.path,
                originalCanvasWidth: myCanvas.width,
                originalCanvasHeight: myCanvas.height,
                left: modifiedObject.left,
                top: modifiedObject.top,
                action: PathActionEnum.WRITE
            };

            // Add path to localstorage
            whiteboard.addPathToSlide(0, data);

            // Send path to socket room
            socket.sendWhiteboardPath(data);

            // Get the localstoage path 
            const localData = whiteboard.getBookMetaData();
            console.log('localData: ', localData);
        }
    }

    function undoPathObjectHandler() {
        const path = whiteboard.undoPathToSlide(0);
        console.log('localData: - path: ', path);
    }

    useEffect(() => {
        if (!canvasRef) return;
        if (!canvasPar) return;

        myCanvas = new fabric.Canvas(
            canvasRef.current,
            {
                isDrawingMode: true,
                height: canvasPar.current.clientHeight,
                width: canvasPar.current.clientWidth,
                enableRetinaScaling: true,
                stateful: true
            }
        );

        myCanvas.freeDrawingBrush.width = 3;
        myCanvas.freeDrawingBrush.color = '#0e0e0e';

        myCanvas.on('object:added', (event: any) => {
            addToBoard(event);
        });
        return () => { };
    }, []);


    return (
        <section className='relative col-span-5 bg-white rounded-md overflow-hidden' ref={canvasPar}>
            <TeacherVideo />
            <div className="whiteboard relative">
                <ToolBar/>
                <div className="controls absolute bottom-0 left-0 z-20">
                    <button className='px-4 py-2 bg-slate-700 text-white font-medium m-2 rounded-md z-20' onClick={() => { undoPathObjectHandler(); }}>undo</button>
                    <button className='px-4 py-2 bg-slate-700 text-white font-medium m-2 rounded-md z-20' onClick={() => { }}>redo</button>
                </div>
                <canvas ref={canvasRef} className='h-full w-full z-0' />
            </div>
        </section>
    );
};

export default TeacherBoard;