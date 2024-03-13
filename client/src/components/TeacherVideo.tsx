import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';

const TeacherVideo = () => {
    const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
    const TOKEN = import.meta.env.VITE_AGORA_TOKEN;
    const CHANNEL = import.meta.env.VITE_AGORA_CHANNEL;
    const videoContainer: any = useRef();

    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
    });

    useEffect(() => {
        const joinChannel = async () => {
            try {
                await client.join(APP_ID, CHANNEL, TOKEN, null);
                const [audioTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                await client.publish([cameraTrack]);

                cameraTrack.play(videoContainer.current);

                client.on('user-published', async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                });

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
        <div id="video-parent" className='z-10 absolute bottom-4 right-4 shadow-md bg-slate-300 w-[16rem] h-[9rem] rounded-md overflow-hidden'>
            <div id="video-container" ref={videoContainer} className='z-10 right-4 shadow-md bg-slate-300 w-[16rem] h-[9rem] rounded-md overflow-hidden'>
            </div>
        </div>
    );
};

export default TeacherVideo;
