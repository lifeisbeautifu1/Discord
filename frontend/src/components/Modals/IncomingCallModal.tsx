import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdPhoneInTalk } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Avatar, Tooltip } from "..";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSocketContext } from "../../contexts/SocketContext";
import { selectUser } from "../../features/auth/auth";

function IncomingCallModal() {
  const user = useAppSelector(selectUser);

  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const { isReceivingCall, caller, callType, activeConversationId } =
    useAppSelector((state) => state.call);

  const socket = useSocketContext();

  const handleClose = () => {
    console.log("handle close");
  };

  const handleCall = (type: "accept" | "reject") => {
    const payload = { caller };
    switch (type) {
      case "accept":
        return callType === "video"
          ? socket.emit("videoCallAccepted", payload)
          : socket.emit("videoCallAccepted", payload);
      case "reject":
        return callType === "video"
          ? socket.emit("videoCallRejected", payload)
          : socket.emit("videoCallRejected", payload);
    }
  };

  return (
    <Transition
      show={
        !!(isReceivingCall && !selectedConversation) ||
        !!(
          isReceivingCall &&
          selectedConversation &&
          selectedConversation.id !== activeConversationId
        )
      }
      as={Fragment}
    >
      <Dialog
        className="absolute inset-0 z-30 flex items-center justify-center"
        onClose={handleClose}
      >
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        ></Transition.Child>
        <Transition.Child
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-175 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0"
        >
          <Dialog.Panel className="flex w-[200px] flex-col items-start overflow-hidden rounded bg-[#18191c] shadow">
            <div className="mt-4 flex w-full flex-col items-center px-4 pt-4 pb-6 text-d-white">
              <div className="relative">
                <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-gray-500" />
                <Avatar
                  size="big"
                  image={`https://cdn.discordapp.com/embed/avatars/${
                    parseInt(caller?.u_name.split("#")[1]!) % 5
                  }.png`}
                />
              </div>

              <h2 className="mt-2 text-lg font-bold text-white">
                {caller?.username}
              </h2>
              <p className="-mt-1 text-d-gray">Incoming call...</p>
              <div className="mt-4 flex items-center space-x-4">
                <Tooltip text="Dismiss">
                  <div
                    onClick={() => handleCall("reject")}
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-500 text-3xl text-d-white"
                  >
                    <IoCloseOutline />
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
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default IncomingCallModal;
