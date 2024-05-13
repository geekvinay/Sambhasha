import { useHMSActions, useHMSStore, selectPeers } from "@100mslive/react-sdk";
import { Icon } from '@iconify/react';
import MdiMicrophone from '@iconify-icons/mdi/microphone';
import MdiMicrophoneOff from '@iconify-icons/mdi/microphone-off';
import MdiVideo from '@iconify-icons/mdi/video';
import MdiVideoOff from '@iconify-icons/mdi/video-off';

const PeoplePanel = () => {
    const peers = useHMSStore(selectPeers);

    return (
        <section className="h-full w-full bg-slate-200 p-2 rounded-md">
            <section className="wrapper-people bg-white rounded-md h-full p-2">
                <div>
                    {peers.map((peer, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded-lg mb-2">
                            <p className="text-base font-medium mr-4">{peer.name}</p>
                            <div className="flex">
                                <Icon icon={peer.audioTrack ? MdiMicrophone : MdiMicrophoneOff} className={`text-${peer.audioTrack ? 'green' : 'gray'}-500 text-xl hover:cursor-pointer mr-2`} />
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
