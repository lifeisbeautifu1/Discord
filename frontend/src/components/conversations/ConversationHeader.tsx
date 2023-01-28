import { Tooltip } from "..";
import { ConverastionCall } from ".";
import { useState } from "react";
import { MdOutlineAlternateEmail, MdGroup } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { BsFillPinAngleFill } from "react-icons/bs";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";
import {
  HiInbox,
  HiPhoneArrowUpRight,
  HiQuestionMarkCircle,
  HiVideoCamera,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";
import { isOnline, toShowFromConversation } from "../../util";
import { useSocketContext } from "../../contexts/SocketContext";
import {
  setActiveConversationId,
  setCaller,
  setIsCalling,
  setLocalStream,
  setMicrophoneEnabled,
  setReceiver,
} from "../../features/call/callSlice";

const ConversationHeader = () => {
  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const { isReceivingCall, isCallInProgress, activeConversationId, callType } =
    useAppSelector((state) => state.call);

  const [isCall, setIsCall] = useState(false);

  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const { onlineFriends } = useAppSelector((state) => state.friends);

  const user = useAppSelector(selectUser);

  if (!selectedConversation || !user) return null;

  const toShow = toShowFromConversation(user?.id, selectedConversation);

  const online = isOnline(user?.id!, toShow?.id!, onlineFriends);

  const group = selectedConversation?.participants.length > 2;

  const groupName = selectedConversation?.participants
    .filter((p) => p.userId !== user?.id)
    .map((p) => p.user?.username)
    .join(", ");

  const callUser = async () => {
    socket?.emit("videoCallInitiate", {
      conversationId: selectedConversation.id,
      recipientId: toShow?.id,
    });
    dispatch(setActiveConversationId(selectedConversation.id));
    dispatch(setReceiver(toShow));
    dispatch(setCaller(user));
    dispatch(setIsCalling(true));
    setIsCall(true);
    console.log(callType);

    const constraints = {
      video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
      audio: true,
    };

    console.log(constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("Receiving Call & Got Local Stream:", stream.id);
    dispatch(setLocalStream(stream));
    // dispatch(setVideoEnabled(true));
    dispatch(setMicrophoneEnabled(true));
  };

  const callHeader =
    (isCall || isReceivingCall || isCallInProgress) &&
    activeConversationId === selectedConversation.id;

  return (
    <header
      className={`flex flex-col ${
        callHeader && "h-auto bg-[#18191c]	pb-4"
      } h-12 w-full flex-shrink-0 border-b border-d-black px-3.5 pr-6 shadow`}
    >
      <div className="flex h-12 w-full items-center justify-between">
        <div className="flex items-center space-x-4">
          {group ? (
            <MdGroup className="text-2xl text-d-gray" />
          ) : (
            <MdOutlineAlternateEmail className="text-2xl text-d-gray" />
          )}
          <h2 className="font-semibold text-d-white">
            {group ? groupName : toShow?.username}
          </h2>
          {!group &&
            (online ? (
              <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-dark bg-green-500"></span>
            ) : (
              <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-d-gray bg-transparent"></span>
            ))}
        </div>
        <div className="flex items-center space-x-4 text-d-gray">
          {!callHeader && !group && (
            <>
              <Tooltip text="Start Voice Call" position="bottom">
                <HiPhoneArrowUpRight
                  onClick={callUser}
                  className="cursor-pointer text-xl hover:text-d-white"
                />
              </Tooltip>
              <Tooltip text="Start Video Call" position="bottom">
                <HiVideoCamera
                  onClick={callUser}
                  className="cursor-pointer text-2xl hover:text-d-white"
                />
              </Tooltip>
            </>
          )}

          <Tooltip text="Pinned Messages" position="bottom">
            <BsFillPinAngleFill className="cursor-pointer text-xl hover:text-d-white" />
          </Tooltip>
          <Tooltip text="Add Friends to DM" position="bottom">
            <FaUserPlus className="cursor-pointer text-xl hover:text-d-white" />
          </Tooltip>
          <Tooltip
            text={group ? "Show Member List" : "Show User Profile"}
            position="bottom"
          >
            {group ? (
              <MdGroup className="cursor-pointer text-2xl hover:text-d-white" />
            ) : (
              <FaUserCircle className="cursor-pointer text-xl hover:text-d-white" />
            )}
          </Tooltip>
          <div
            className={`flex w-full max-w-[130px] items-center rounded bg-d-dark-black ${
              callHeader && "!bg-secondary-alt"
            } py-0.5 pl-1.5 pr-2 text-sm text-d-gray transition-all duration-300 ease-out placeholder:text-d-gray focus-within:max-w-[200px]`}
          >
            <input
              type="text"
              placeholder="Search"
              className="w-full border-none bg-transparent font-semibold shadow-inner outline-none placeholder:font-semibold"
            />
            <BiSearch className="flex-shrink-0 text-base" />
          </div>
          <Tooltip position="bottom" text="Inbox">
            <HiInbox className="h-[25px] w-[25px] cursor-pointer transition hover:text-d-white" />
          </Tooltip>
          <Tooltip position="bottom" text="Help">
            <HiQuestionMarkCircle
              className={`h-[25px] w-[25px] cursor-pointer text-green-600 ${
                callHeader && "!text-d-gray"
              }`}
            />
          </Tooltip>
        </div>
      </div>
      {callHeader && <ConverastionCall />}
    </header>
  );
};

export default ConversationHeader;
