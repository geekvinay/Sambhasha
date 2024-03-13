import AgoraRTC from 'agora-rtc-sdk-ng';
import React, { useEffect, useRef, useState } from 'react';

const StudentPanel = () => {
    const [teacherVideoTrack, setTeacherVideoTrack] = useState(null) as any;
    const APP_ID = 'ce247b150c49484b9a4e5ef856e94390';
    const TOKEN = "007eJxTYHB5yiV4+15oVUYzX8qn22VatddSvGXsvLP9+PeHdrLa1CgwJKcamZgnGZoaJJtYmliYJFkmmqSapqZZmJqlWpoYWxrE7HqT2hDIyJCZlc7KyACBID4rQ3l+UU4KAwMAvlEdjg==";
    const CHANNEL = 'world';
    const teacherVideo: any = useRef();
    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
    });
    useEffect(() => {
        const joinChannel = async () => {
            try {
                await client.join(APP_ID, CHANNEL, TOKEN, null);
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                await client.publish([microphoneTrack, cameraTrack]);

                client.on('user-published', async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                    console.log('User published:', user);
                    user.videoTrack?.play(teacherVideo);
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
        <section className='col-span-2 h-full rounded-md'>
            <div ref={teacherVideo} className='teacher-video w-full h-[10rem] bg-red-200 mb-4 rounded-md'></div>
            <section className="controls w-full py-2 bg-white rounded-md">
            </section>
        </section>
    );
};

export default StudentPanel;