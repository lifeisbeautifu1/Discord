import { motion, PanInfo, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { HiPhoneXMark } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { Avatar } from "../";
import { useSocketContext } from "../../contexts/SocketContext";

const CallModal = () => {
  const controls = useAnimation();

  const [show, setShow] = useState(false);

  const socket = useSocketContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { user } = useAppSelector((state) => state.auth);

  const {
    activeConversationId,
    caller,
    receiver,
    isCallInProgress,
    localStream,
    remoteStream,
    videoEnabled,
    updateRemoteStream,
  } = useAppSelector((state) => state.call);

  const { pathname } = useLocation();

  useEffect(() => {
    setShow(
      isCallInProgress && pathname != `/channels/@me/${activeConversationId}`
    );
  }, [isCallInProgress, pathname]);

  useEffect(() => {
    console.log("local stream was updated...");
    console.log(localStream);
    console.log(localVideoRef.current);
    if (localVideoRef.current && localStream) {
      console.log("updating local video ref");
      console.log(`Updating local stream ${localStream.id}`);
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream, videoEnabled, show]);

  useEffect(() => {
    console.log("remote stream was updated...");
    console.log(remoteStream);
    console.log(remoteVideoRef.current);
    if (remoteVideoRef.current && remoteStream) {
      console.log("updating remote video ref");
      console.log(`Updating remote stream ${remoteStream.id}`);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, updateRemoteStream, show]);

  const closeCall = () => {
    socket?.emit("videoCallHangUp", { caller, receiver });
  };

  const otherDude = caller?.id === user?.id ? receiver : caller;

  if (!show) return null;

  return (
    <motion.div
      className="absolute bottom-14 right-20 z-20"
      animate={controls}
      transition={{
        type: "spring",
        damping: 40,
        stiffness: 400,
      }}
      initial="bottomRight"
      variants={{
        topLeft: { y: -window.innerHeight / 1.5, x: -window.innerWidth / 1.5 },
        bottomLeft: { y: 0, x: -window.innerWidth / 1.5 },
        topRight: { y: -window.innerHeight / 1.5, x: 0 },
        bottomRight: {
          y: 0,
          x: 0,
        },
      }}
      onDragEnd={(e, ui: PanInfo) => {
        const { x, y } = ui.point;
        console.log(x, y);

        if (x > window.innerWidth / 2 && y > window.innerHeight / 2) {
          controls.start("bottomRight");
        } else if (x > window.innerWidth / 2 && y < window.innerHeight / 2) {
          controls.start("topRight");
        } else if (x < window.innerWidth / 2 && y > window.innerHeight / 2) {
          controls.start("bottomLeft");
        } else {
          controls.start("topLeft");
        }
      }}
      drag
      dragMomentum={false}
    >
      <div
        className={`group relative flex h-40 w-[280px] flex-col items-start overflow-hidden rounded-xl bg-d-black shadow-xl transition-all duration-300 ease-out`}
      >
        <div className="invisible absolute top-0 left-0 right-0 z-[10] h-10 -translate-y-8 bg-gradient-to-b from-black to-transparent transition-all duration-300 ease-out group-hover:visible group-hover:-translate-y-0" />
        <div className="invisible absolute bottom-0 left-0 right-0 z-[10] h-10 translate-y-8 bg-gradient-to-t from-black to-transparent transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0" />
        <Link
          className="invisible absolute top-1 left-2 z-20 flex -translate-y-8 cursor-pointer items-center border-white font-semibold outline-none transition-transform duration-300 ease-out group-hover:visible group-hover:translate-y-0 hover:border-b"
          to={
            activeConversationId
              ? `/channels/@me/${activeConversationId}`
              : "/channels/@me"
          }
        >
          <BsArrowLeft className="mr-1 inline-block text-d-gray" />
          <span className="text-white">john</span>
        </Link>
        <div
          onClick={closeCall}
          className="invisible absolute bottom-2 right-2 z-20 translate-y-8 cursor-pointer items-center text-d-gray transition-all duration-300 group-hover:visible group-hover:translate-y-0 hover:text-d-white"
        >
          <HiPhoneXMark className="h-6 w-6" />
        </div>
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          {remoteStream && updateRemoteStream ? (
            <>
              <video
                className="h-40 w-72 rounded-md"
                ref={remoteVideoRef}
                playsInline
                autoPlay
                controls={false}
              />
              <video
                className="hidden h-40 w-72 rounded-lg"
                ref={localVideoRef}
                playsInline
                autoPlay
                controls={false}
              />
            </>
          ) : localStream && videoEnabled ? (
            <>
              <video
                className="h-40 w-72 rounded-lg"
                ref={localVideoRef}
                playsInline
                autoPlay
                controls={false}
              />
              <video
                className="hidden h-40 w-72 rounded-lg"
                ref={remoteVideoRef}
                playsInline
                autoPlay
                controls={false}
              />
            </>
          ) : (
            <>
              <Avatar
                image={`https://cdn.discordapp.com/embed/avatars/${
                  parseInt(otherDude?.u_name.split("#")[1]!) % 5
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
              <video
                className="hidden h-40 w-72 rounded-lg"
                ref={remoteVideoRef}
                playsInline
                autoPlay
                controls={false}
              />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CallModal;
