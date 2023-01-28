import { CallActions } from ".";
import { useRef, useEffect } from "react";
import { Avatar } from "../..";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/auth/auth";

const ConversationCall = () => {
  const {
    caller,
    receiver,
    localStream,
    remoteStream,
    videoEnabled,
    updateRemoteStream,
    isReceivingCall,
    isCalling,
  } = useAppSelector((state) => state.call);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("local stream was updated...");
    console.log(localStream);
    if (localVideoRef.current && localStream) {
      console.log("updating local video ref");
      console.log(`Updating local stream ${localStream.id}`);
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream, videoEnabled]);

  useEffect(() => {
    console.log("remote stream was updated...");
    console.log(remoteStream);
    if (remoteVideoRef.current && remoteStream) {
      console.log("updating remote video ref");
      console.log(`Updating remote stream ${remoteStream.id}`);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, updateRemoteStream]);

  const user = useAppSelector(selectUser);

  const otherDude = caller?.id === user?.id ? receiver : caller;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 justify-center space-x-3 overflow-hidden py-10">
        {localStream && videoEnabled ? (
          <video
            className="h-40 w-72 rounded-lg"
            ref={localVideoRef}
            playsInline
            autoPlay
            controls={false}
          />
        ) : (
          <div className="flex flex-shrink-0 items-center">
            <Avatar
              image={`https://cdn.discordapp.com/embed/avatars/${
                parseInt(user?.u_name.split("#")[1]!) % 5
              }.png`}
              size="big"
            />
            <video
              className="hidden h-40 w-72 rounded-lg"
              ref={localVideoRef}
              playsInline
              autoPlay
              controls={false}
            />
          </div>
        )}
        {remoteStream && updateRemoteStream ? (
          <video
            className="h-40 w-72 rounded-lg"
            ref={remoteVideoRef}
            playsInline
            autoPlay
            controls={false}
          />
        ) : (
          <div className="relative flex flex-shrink-0 items-center">
            <Avatar
              image={`https://cdn.discordapp.com/embed/avatars/${
                parseInt(otherDude?.u_name.split("#")[1]!) % 5
              }.png`}
              size="big"
            />
            {(isReceivingCall || isCalling) && (
              <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-gray-500" />
            )}
            <video
              className="hidden h-40 w-72 rounded-lg"
              ref={remoteVideoRef}
              playsInline
              autoPlay
              controls={false}
            />
          </div>
        )}
      </div>
      <CallActions />
    </div>
  );
};

export default ConversationCall;
