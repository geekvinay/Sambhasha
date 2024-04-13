import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useRef } from 'react';
import ChatPanel from './ChatPanel';
import SocketSerivce from '../services/socket';

const StudentPanel = ({ socket }: { socket: SocketSerivce; }) => {
    const APP_ID = 'ce247b150c49484b9a4e5ef856e94390';
    const TOKEN = "007eJxTYOjQPMLF+I9xeoxqtftpkRDzx1EprRxu7Syr70w9ZLC8oUuBITnVyMQ8ydDUINnE0sTCJMky0STVNDXNwtQs1dLE2NLAvvVjakMgI4P8axUGRigE8SUYzEzTDM1TTFOTUiwMjI1STRLNzUyNTc3NGBgA9r0heA==";
    const CHANNEL = '65f17d5ebd8032e4a7653576';
    const teacherVideoRef: any = useRef();
    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
    });
    useEffect(() => {
        const joinChannel = async () => {
            try {
                await client.join(APP_ID, CHANNEL, TOKEN, null);
                const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                console.log('audioTrack: ', Boolean(audioTrack));
                await client.publish([audioTrack]);

                // cameraTrack.play(teacherVideoRef.current);
                client.on('user-published', async (user, mediaType) => {
                    console.log('user, mediaType: ', user, mediaType);
                    await client.subscribe(user, mediaType);
                    if (mediaType === 'video') {
                        user.videoTrack ? user.videoTrack.play(teacherVideoRef.current): "";
                    }
                    user.audioTrack?.play();
                });
            } catch (error) {
                console.error('Error joining channel:', error);
            }
        };

        joinChannel();

        return () => {
        };
    }, []);

    return (
        <section className='col-span-2 flex flex-col justify-between h-full rounded-md'>
            <div className='h-[25vh] w-full bg-white p-4 box-border rounded-md'>
                <div id="video-container" ref={teacherVideoRef} className='z-10 shadow-md bg-slate-300 min-w-[16rem] min-h-[7rem] w-full h-full rounded-md overflow-hidden'>
                </div>
            </div>
            <section className="controls h-[68vh] w-full bg-white rounded-md">
                <ChatPanel socket={socket} />
            </section>
        </section>
    );
};

export default StudentPanel;
