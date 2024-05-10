import { useHMSActions, selectPeers, useHMSStore, useVideo, useAVToggle } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";

const VideoPanel = () => {
  const hmsActions = useHMSActions();
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
  console.log('isLocalAudioEnabled: ', isLocalAudioEnabled);
  console.log('isLocalVideoEnabled: ', isLocalVideoEnabled);
  const peers = useHMSStore(selectPeers);
  const [inputValues, setInputValues] = useState({
    name: "Vinay kishore",
    token: "djh-fuyi-zqn",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: any) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { name, token } = inputValues;

    if (!name || !token) {
      setError("Please fill in all the required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode: token });
      await hmsActions.join({
        userName: name, authToken, settings: {
          isVideoMuted: false,
        },
        rememberDeviceSelection: true,  
      });
    } catch (e: any) {
      setError("Failed to join the room. Please check the room code and try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="VideoPanel">
      <form onSubmit={handleSubmit}>
        <h1>VideoPanel</h1>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={inputValues.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="token"
          placeholder="Enter the room code"
          value={inputValues.token}
          onChange={handleInputChange}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Join"}
        </button>
      </form>
      <section className="peers">
        {peers.map(peer =>
          <Peer key={peer.id} peer={peer}></Peer>
        )}
      </section>
    </section>
  );
};

export default VideoPanel;

function Peer({ peer }: { peer: any; }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  return (
    <div className="peer-container">
      <video
        ref={videoRef}
        key={peer.id}
        className={`peer-video ${peer.isLocal ? "local" : ""}`}
        autoPlay
        muted={peer.isLocal} // Mute local video to avoid echo
        playsInline
      />
      <div className="peer-name">
        {peer.name} {peer.isLocal ? "(You)" : ""}
      </div>
    </div>
  );
}