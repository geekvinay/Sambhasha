import { useEffect, useState } from "react";
import { selectLocalPeer, selectPeers, useAVToggle, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import MdiMicrophone from '@iconify-icons/mdi/microphone';
import MdiMicrophoneOff from '@iconify-icons/mdi/microphone-off';
import MdiVideoOff from '@iconify-icons/mdi/video-off';
import MdiVideoOn from '@iconify-icons/mdi/video';
import MdiLoading from '@iconify-icons/mdi/loading';
import { Icon } from "@iconify/react/dist/iconify.js";
import placeholderImage from "../../../assets/user.png";
import SocketService from "../../../services/socket";

const VideoPanel = ({ socket, isTeacher = true }: { socket: SocketService; isTeacher: boolean; }) => {
  const hmsActions = useHMSActions();
  const sessionDetails = JSON.parse(localStorage.getItem("session-details") || "{}");
  let { userName, roomCode } = sessionDetails;
  userName = userName || "A VINAY KISHORE";
  roomCode = roomCode || "ycd-mdix-jts";
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  console.log('setIsAudioMuted: ', setIsAudioMuted);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { isLocalAudioEnabled, toggleAudio, toggleVideo } = useAVToggle();
  console.log('toggleVideo: ', toggleVideo);

  socket.on('receive_unmute_request', (data) => {
    if (data == localPeer?.id) {
      console.log("Unmuting the peer!!!! ", localPeer?.name);
      hmsActions.setLocalAudioEnabled(true);
    }
  });

  useEffect(() => {
    const handleJoin = async () => {
      try {
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
        await hmsActions.join({
          userName: userName,
          authToken,
          rememberDeviceSelection: true,
          settings: {
            isAudioMuted: false,
            isVideoMuted: true
          }
        });
        setIsLoading(false);
        setShowControls(false);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };

    handleJoin();
  }, [hmsActions, roomCode, userName, isTeacher]);

  const teacherPeer = peers.find(peer => peer.roleName === 'teacher' && !peer.isLocal);
  const { videoRef } = useVideo({ trackId: teacherPeer?.videoTrack });

  return (
    <section className="VideoPanel relative bg-white p-2 rounded-md">
      <div className="video-wrapper relative h-full w-full">
        <div
          className="local-video-container flex justify-start w-full h-[25vh] rounded-md relative box-border"
          style={{ backgroundImage: `url(${placeholderImage})`, backgroundSize: "cover" }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="video-overlay rounded-md w-full h-full absolute top-0 left-0" style={{ opacity: isVideoMuted ? 1 : 0 }}>
            {isLoading && <Icon icon={MdiLoading} className="text-gray-500 text-4xl" />}
          </div>
          <video
            ref={videoRef}
            className={`local-video rounded-md h-full w-full object-cover ${isVideoMuted ? "opacity-0" : "opacity-100"} transition-all`}
            autoPlay
            muted={isAudioMuted}
            playsInline
          />
          {showControls && (
            <div className="absolute top-0 left-0 flex h-full w-full justify-center items-center">
              <div className="bg-black h-full w-full bg-opacity-50 rounded-md p-4 flex space-x-4 items-center justify-center hover:cursor-pointer">
                {isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer">
                    <Icon icon={MdiLoading} className="animate-spin text-gray-900 text-4xl" />
                  </div>
                )}
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
                {!isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={() => setIsVideoMuted(prev => !prev)}>
                    {isVideoMuted ? (
                      <Icon icon={MdiVideoOff} className="text-gray-500 text-2xl" />
                    ) : (
                      <Icon icon={MdiVideoOn} className="text-gray-500 text-2xl" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="video-title relative w-full px-2 pt-2 font-medium z-10 flex">
          <span className="text-md font-bold pr-2 text-sky-700">TEACHER</span>
          {teacherPeer && teacherPeer.name}
        </div>
      </div>
    </section>
  );
};

export default VideoPanel;
