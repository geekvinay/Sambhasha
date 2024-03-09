import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';

const TeacherVideo = () => {
    const APP_ID = 'ce247b150c49484b9a4e5ef856e94390';
    const TOKEN = "007eJxTYHB5yiV4+15oVUYzX8qn22VatddSvGXsvLP9+PeHdrLa1CgwJKcamZgnGZoaJJtYmliYJFkmmqSapqZZmJqlWpoYWxrE7HqT2hDIyJCZlc7KyACBID4rQ3l+UU4KAwMAvlEdjg==";
    const CHANNEL = 'world';
    const videoContainer: any = useRef();

    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
    });

    useEffect(() => {
        const joinChannel = async () => {
            try {
                await client.join(APP_ID, CHANNEL, TOKEN, null);
                const [, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                await client.publish([cameraTrack]);

                cameraTrack.play(videoContainer.current);
            } catch (error) {
                console.error('Error joining channel:', error);
            }
        };

        joinChannel();

        return () => {
            client.leave();
        };
    }, []);

    return (
        <div id="video-container" ref={videoContainer} className='absolute bottom-4 right-4 shadow-md bg-slate-300 w-[16rem] h-[9rem] rounded-md overflow-hidden'>
        </div>
    );
};

export default TeacherVideo;
