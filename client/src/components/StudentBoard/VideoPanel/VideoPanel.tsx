import { useEffect, useState } from "react";
import { selectPeers, useHMSActions, useHMSStore, useVideo } from "@100mslive/react-sdk";

const VideoPanel = ({ isTeacher = true }) => {
  const hmsActions = useHMSActions();
  const sessionDetails = JSON.parse(localStorage.getItem("session-details") || "{}");
  const { userName = "Student 12345", roomCode = "pdz-ieeq-jma" } = sessionDetails;
  const peers = useHMSStore(selectPeers);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to store the video element

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

  const teacherPeer = peers.find(peer => peer.roleName === 'teacher' && !peer.isLocal);
  const { videoRef } = useVideo({ trackId: teacherPeer?.videoTrack });

  console.log('teacherPeer: ', teacherPeer);

  return (
    <section className="VideoPanel relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      {teacherPeer && (
        <div className="video-wrapper relative h-full w-full">
          <div className="video-title absolute bottom-0 left-0 w-full p-2">
            {teacherPeer.name}
          </div>
          <video
            ref={videoRef}
            className="video rounded-md"
            muted
            autoPlay
            playsInline
          />
        </div>
      )}
    </section>
  );
};

export default VideoPanel;
