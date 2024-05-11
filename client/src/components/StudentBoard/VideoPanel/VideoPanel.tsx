import { useEffect, useState } from "react";
import { selectPeers, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";
import MdiVolumeOff from '@iconify-icons/mdi/volume-off';
import MdiVolumeHigh from '@iconify-icons/mdi/volume-high';
import MdiVideoOff from '@iconify-icons/mdi/video-off';
import MdiVideoOn from '@iconify-icons/mdi/video';
import MdiLoading from '@iconify-icons/mdi/loading';
import { Icon } from "@iconify/react/dist/iconify.js";
import placeholderImage from "../../../assets/user-placeholder.png";

const VideoPanel = ({ isTeacher = true }) => {
  const hmsActions = useHMSActions();
  const sessionDetails = JSON.parse(localStorage.getItem("session-details") || "{}");
  const { userName = "Student 12345", roomCode = "uoo-vets-nbt" } = sessionDetails;
  const peers = useHMSStore(selectPeers);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const handleJoin = async () => {
      try {
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
        await hmsActions.join({
          userName: userName,
          authToken,
          rememberDeviceSelection: true,
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

  const toggleAudio = () => {
    setIsAudioMuted(prevState => !prevState);
    console.log('isAudioMuted: ', isAudioMuted);
  };

  const toggleVideo = () => {
    setIsVideoMuted(prevState => !prevState);
    console.log('isAudioMuted: ', isVideoMuted);
  };

  return (
    <section className="VideoPanel relative ">
      <div className="video-wrapper relative h-full w-full">
        <div
          className="local-video-container flex justify-start w-full h-[25vh] rounded-md relative"
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
                {!isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleAudio}>
                    {isAudioMuted ? (
                      <Icon icon={MdiVolumeOff} className="text-gray-500 text-2xl" />
                    ) : (
                      <Icon icon={MdiVolumeHigh} className="text-gray-500 text-2xl" />
                    )}
                  </div>
                )}
                {!isLoading && (
                  <div className="p-2 bg-white hover:shadow-sm rounded-xl cursor-pointer" onClick={toggleVideo}>
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
        <div className="video-title relative w-full p-2 font-medium z-10 flex">
          {teacherPeer && <span className="text-md font-bold px-2 text-sky-700">TEACHER</span>}
          {teacherPeer && teacherPeer.name}
        </div>
      </div>
    </section>
  );
};

export default VideoPanel;
