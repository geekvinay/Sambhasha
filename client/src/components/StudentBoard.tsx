import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import SocketSerivce from '../services/socket';

const StudentBoard = ({ socket }: { socket: SocketSerivce; }) => {

    let myCanvas: fabric.Canvas;
    const canvasRef = useRef() as any;
    const canvasPar = useRef() as any;

    useEffect(() => {
        if (!canvasRef) return;
        if (!canvasPar) return;
        myCanvas = new fabric.Canvas(
            canvasRef.current,
            {
                isDrawingMode: false,
                height: canvasPar.current.clientHeight,
                width: canvasPar.current.clientWidth,
            }
        );

        socket.socket.on("receive_whiteboard_path", (payload: any) => {
            console.log('payload: ', payload);
            try {
                const pathObject = new fabric.Path(payload.path, {
                    strokeWidth: 3,
                    stroke: '#0e0e0e',
                    fill: ""
                });
                if (!myCanvas.width || !myCanvas.height) {
                    throw new Error("Canvas not mounted!!!!");
                }
                // Scale the path to fit the new canvas dimensions
                const scaleX = myCanvas.width / payload.originalCanvasWidth;
                const scaleY = myCanvas.height / payload.originalCanvasHeight;
                pathObject.scaleX = scaleX;
                pathObject.scaleY = scaleY;
                // Calculate the adjusted position based on the scaling factor
                if (!pathObject.left || !pathObject.top) {
                    throw new Error("Path position not found!!!!");
                }

                const adjustedLeft = pathObject.left * scaleX;
                const adjustedTop = pathObject.top * scaleY;

                // Set the adjusted position
                pathObject.set({ left: adjustedLeft, top: adjustedTop });



                myCanvas.add(pathObject);
                myCanvas.renderAll();
            } catch (error) {
                console.error("Error creating fabric path object:", error);
            }
        });
    });
    return (
        <section className='col-span-5 bg-white rounded-md overflow-hidden' ref={canvasPar}>
            <canvas ref={canvasRef} className='h-full w-full' />
        </section>
    );
};

export default StudentBoard;