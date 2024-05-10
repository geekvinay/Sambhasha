import { selectPeers, useAVToggle, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import MdiMicrophone from '@iconify-icons/mdi/microphone';
import MdiMicrophoneOff from '@iconify-icons/mdi/microphone-off';
import MdiVideoOff from '@iconify-icons/mdi/video-off';
import MdiVideoOn from '@iconify-icons/mdi/video';

const VideoPanel = ({ isTeacher = true }) => {
  const hmsActions = useHMSActions();
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
  const sessionDetails = JSON.parse(localStorage.getItem("session-details") || "{}");
  const { userName, roomCode } = sessionDetails;
  const peers = useHMSStore(selectPeers);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const handleJoin = async () => {
      try {
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
        await hmsActions.join({
          userName: userName,
          authToken,
          settings: {
            isVideoMuted: !isTeacher,
            isAudioMuted: !isTeacher,
          },
          rememberDeviceSelection: true,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };

    handleJoin();
  }, [hmsActions, roomCode, userName, isTeacher]);

  const localPeer = peers.find(peer => peer.isLocal);

  const { videoRef } = useVideo({
    trackId: localPeer?.videoTrack,
  });

  return (
    <section className="VideoPanel relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div
        className="local-video-container flex justify-start p-2 rounded-md relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isTeacher && isLocalVideoEnabled && (
          <video
            ref={videoRef}
            className="local-video rounded-md"
            autoPlay
            playsInline
          />
        )}
        {showControls && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-black h-full w-full bg-opacity-50 rounded-md p-4 flex space-x-4 items-center justify-center hover:cursor-pointer">
              <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleAudio}>
                {isLocalAudioEnabled ? (
                  <Icon icon={MdiMicrophone} className="text-gray-500 text-2xl" />
                ) : (
                  <Icon icon={MdiMicrophoneOff} className="text-gray-500 text-2xl" />
                )}
              </div>
              <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleVideo}>
                {isLocalVideoEnabled ? (
                  <Icon icon={MdiVideoOn} className="text-gray-500 text-2xl" />
                ) : (
                  <Icon icon={MdiVideoOff} className="text-gray-500 text-2xl" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoPanel;
