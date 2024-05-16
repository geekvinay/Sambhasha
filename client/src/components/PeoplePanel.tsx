import { useHMSStore, selectPeers } from "@100mslive/react-sdk";
import { Icon } from '@iconify/react';
import MdiMicrophone from '@iconify-icons/mdi/microphone';
import MdiMicrophoneOff from '@iconify-icons/mdi/microphone-off';
import MdiVideo from '@iconify-icons/mdi/video';
import MdiVideoOff from '@iconify-icons/mdi/video-off';
import SocketService from "../services/socket";
import { useEffect, useState } from "react";

const PeoplePanel = ({ socket, isTeacher }: { socket: SocketService; isTeacher: boolean }) => {
    const [askForUnmute, setAskForUnmute] = useState<any>(null);
    const peers = useHMSStore(selectPeers);

    useEffect(() => {
        if (askForUnmute && isTeacher) {
            console.log('askForUnmute: ', askForUnmute);
            socket.sendUnmuteRequest(askForUnmute?.id);
        }
    }, [askForUnmute]);

    return (
        <section className="h-full w-full bg-slate-200 p-2 rounded-md">
            <section className="wrapper-people bg-white rounded-md h-full p-2">
                <div>
                    {peers.map((peer, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded-lg mb-2">
                            <p className="text-base font-medium mr-4">{peer.name}</p>
                            <div className="flex">
                                <Icon icon={peer.audioTrack ? MdiMicrophone : MdiMicrophoneOff} className={`text-${peer.audioTrack ? 'green' : 'gray'}-500 text-xl hover:cursor-pointer mr-2`} onClick={() => setAskForUnmute(peer)} />
                                <Icon icon={peer.videoTrack ? MdiVideo : MdiVideoOff} className={`text-${peer.videoTrack ? 'green' : 'gray'}-500 text-xl hover:cursor-pointer mr-2`} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default PeoplePanel;
