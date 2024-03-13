import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useRef, useState } from 'react';
import ChatPanel from './ChatPanel';
import SocketSerivce from '../services/socket';

const StudentPanel = ({socket}: {socket: SocketSerivce}) => {
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
                const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
                await client.publish([microphoneTrack]);

                client.on("user-published", (user, mediaType) => {
                    console.log('user, mediaType: ', user, mediaType);
                    if (mediaType == 'video') {
                        console.log('user.hasVideo: ', user.hasVideo);
                        console.log('user.videoTrack: ', user.videoTrack);
                    }
                });
            } catch (error) {
                console.error('Error joining channel:', error);
            }
        };

        joinChannel();

        return () => {
            // Clean up resources when component unmounts
            client.leave();
        };
    }, []);

    return (
        <section className='col-span-2 flex flex-col justify-between h-full rounded-md'>
            <div className='max-h-[25vh] w-full right-4 bg-white p-4 box-border rounded-md'>
                <video id="video-container" ref={teacherVideoRef} className='z-10 w-full h-full shadow-md bg-slate-300 rounded-md overflow-hidden'>
                </video>
            </div>
            <section className="controls h-[68vh] w-full bg-white rounded-md">
                <ChatPanel socket={socket}/>
            </section>
        </section>
    );
};

export default StudentPanel;
