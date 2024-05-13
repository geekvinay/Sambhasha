import { selectPeers, useAVToggle, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import MdiMicrophone from '@iconify-icons/mdi/microphone';
import MdiMicrophoneOff from '@iconify-icons/mdi/microphone-off';
import MdiVideoOff from '@iconify-icons/mdi/video-off';
import MdiVideoOn from '@iconify-icons/mdi/video';
import MdiLoading from '@iconify-icons/mdi/loading';
import userImage from "../../../assets/user.png";

const VideoPanel = ({ isTeacher = true }) => {
  const hmsActions = useHMSActions();
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
  const sessionDetails = JSON.parse(localStorage.getItem("session-details") || "{}");
  let { userName, roomCode } = sessionDetails;
  userName = userName || "TEACHER 1234";
  roomCode = roomCode || "ryh-eogu-rau";
  const peers = useHMSStore(selectPeers);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

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
    <section className="VideoPanel relative w-full h-fit p-4 bg-white rounded-md">
      <img src={userImage} alt="" className="h-full w-full rounded-md"/>
      <div
        className="local-video-containera absolute top-0 left-0 w-full h-full flex justify-start rounded-md"
        // style={{ backgroundImage: `url(${placeholderImage})`, backgroundSize: "cover" }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isTeacher && isLocalVideoEnabled && (
          <video
            ref={videoRef}
            className="local-video w-full h-full object-cover rounded-md"
            autoPlay
            muted
            playsInline
          />
        )}
        {showControls && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-black h-full w-full bg-opacity-50 rounded-md p-4 flex space-x-4 items-center justify-center hover:cursor-pointer">
              {
                isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleAudio}>
                    <Icon icon={MdiLoading} className="animate-spin text-gray-900 text-4xl" />
                  </div>
                )
              }
              {
                !isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleAudio}>
                    {isLocalAudioEnabled ? (
                      <Icon icon={MdiMicrophone} className="text-gray-500 text-2xl" />
                    ) : (
                      <Icon icon={MdiMicrophoneOff} className="text-gray-500 text-2xl" />
                    )}
                  </div>
                )
              }
              {
                !isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleVideo}>
                    {isLocalVideoEnabled ? (
                      <Icon icon={MdiVideoOn} className="text-gray-500 text-2xl" />
                    ) : (
                      <Icon icon={MdiVideoOff} className="text-gray-500 text-2xl" />
                    )}
                  </div>
                )
              }
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoPanel;
