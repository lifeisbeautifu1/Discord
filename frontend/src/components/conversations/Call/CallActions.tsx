import { BsFillCameraVideoFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { MdPhoneInTalk } from "react-icons/md";
import { HiPhoneMissedCall } from "react-icons/hi";
import Tooltip from "../../util/Tooltip";
import { ShareScreenIcon } from "../../icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useSocketContext } from "../../../contexts/SocketContext";
import {
  setMicrophoneEnabled,
  setVideoEnabled,
} from "../../../features/call/callSlice";

const CallActions = () => {
  const {
    isReceivingCall,
    caller,
    callType,
    receiver,
    localStream,
    microphoneEnabled,
    videoEnabled,
  } = useAppSelector((state) => state.call);

  const socket = useSocketContext();

  const closeCall = () => {
    socket?.emit("videoCallHangUp", { caller, receiver });
  };

  const dispatch = useAppDispatch();

  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !microphoneEnabled;
      dispatch(setMicrophoneEnabled(!microphoneEnabled));
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !videoEnabled;
      socket?.emit("updateRemoteStream", { caller, receiver });
      dispatch(setVideoEnabled(!videoEnabled));
    }
  };

  const handleCall = (type: "accept" | "reject") => {
    const payload = { caller };
    switch (type) {
      case "accept": {
        callType === "video"
          ? socket.emit("videoCallAccepted", payload)
          : socket.emit("videoCallAccepted", payload);
        return;
      }
      case "reject": {
        callType === "video"
          ? socket.emit("videoCallRejected", payload)
          : socket.emit("videoCallRejected", payload);
        return;
      }
    }
  };
  return (
    <div className="flex items-center space-x-4">
      {isReceivingCall ? (
        <>
          <Tooltip text="Join Video Call">
            <div
              onClick={() => handleCall("accept")}
              className="action-icon bg-green-500 text-white hover:bg-green-500"
            >
              <BsFillCameraVideoFill />
            </div>
          </Tooltip>
          <Tooltip text="Join Call">
            <div
              onClick={() => handleCall("accept")}
              className="action-icon bg-green-500 text-2xl text-white hover:bg-green-500"
            >
              <MdPhoneInTalk />
            </div>
          </Tooltip>
        </>
      ) : (
        <>
          {videoEnabled ? (
            <Tooltip text="Turn Off Camera">
              <div
                onClick={toggleVideo}
                className="action-icon bg-white text-black hover:bg-white"
              >
                <BsFillCameraVideoFill />
              </div>
            </Tooltip>
          ) : (
            <Tooltip text="Turn On Camera">
              <div onClick={toggleVideo} className="action-icon">
                <BsFillCameraVideoFill />
              </div>
            </Tooltip>
          )}
          <Tooltip text="Share Your Screen">
            <div className="action-icon">
              <ShareScreenIcon />
            </div>
          </Tooltip>
          {microphoneEnabled ? (
            <Tooltip text="Mute">
              <div onClick={toggleMicrophone} className="action-icon">
                <FaMicrophone />
              </div>
            </Tooltip>
          ) : (
            <Tooltip text="Unmute">
              <div
                onClick={toggleMicrophone}
                className="action-icon relative bg-white  text-black after:absolute after:top-1/2 after:left-1/2  after:h-2/5  after:translate-y-[-50%] after:translate-x-[-50%] after:rotate-45 after:border after:border-red-500 hover:bg-white"
              >
                <FaMicrophone />
              </div>
            </Tooltip>
          )}

          <Tooltip text="Disconnect">
            <div
              onClick={closeCall}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-500 text-2xl text-d-white"
            >
              <HiPhoneMissedCall />
            </div>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default CallActions;
