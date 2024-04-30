import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';

const TeacherVideo = () => {
    const APP_ID = "ce247b150c49484b9a4e5ef856e94390";
    const TOKEN = "007eJxTYCgTW6t+Uj8n/9W9h1m+B9PbQxa+3/DS/py6ifX6P74LMsoVGJJTjUzMkwxNDZJNLE0sTJIsE01STVPTLEzNUi1NjC0NClZ+Sm0IZGR4qZnNzMgAgSC+BIOZaZqheYppalKKhYGxUapJormZqbGpuRkDAwB5PyV4";
    const CHANNEL = "65f17d5ebd8032e4a7653576";
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
                console.log('audioTrack: ', Boolean(audioTrack));
                await client.publish([cameraTrack]);

                // Lower the video quality
                cameraTrack.setEncoderConfiguration({
                    width: 160,
                    height: 120,
                    frameRate: 5,
                    bitrateMin: 120,
                    bitrateMax: 300,
                });
                cameraTrack.play(videoContainer.current);
                await client.publish([audioTrack, cameraTrack]);

                client.on('user-published', async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                });

            } catch (error) {
                console.error('Error joining channel:', error);
            }
        };

        // joinChannel();

        return () => {
        };
    }, []);

    return (
        // <div id="video-parent" className='z-10 absolute bottom-4 right-4 shadow-md bg-slate-300 w-[16rem] h-[9rem] rounded-md overflow-hidden'>
        //     <div id="video-container" ref={videoContainer} className='z-10 right-4 shadow-md bg-slate-300 w-[16rem] h-[9rem] rounded-md overflow-hidden'>
        //     </div>
        // </div>
        <></>
    );
};

export default TeacherVideo;
