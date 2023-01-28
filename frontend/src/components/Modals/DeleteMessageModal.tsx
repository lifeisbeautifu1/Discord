import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";
import { formatRelative } from "date-fns";
import {
  setIsDeleteMessageModalOpen,
  setSelectedMessage,
} from "../../features/conversations/conversations";
import { deleteMessage } from "../../features/conversations/conversations.thunks";

function DeleteMessageModal() {
  const user = useAppSelector(selectUser);

  const { isDeleteMessageModalOpen, selectedMessage } = useAppSelector(
    (state) => state.conversations
  );

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setIsDeleteMessageModalOpen(false));
    dispatch(setSelectedMessage(null));
  };

  const handleDelete = () => {
    if (selectedMessage)
      dispatch(
        deleteMessage({
          conversationId: selectedMessage?.conversationId,
          messageId: selectedMessage?.id,
        })
      );
    dispatch(setIsDeleteMessageModalOpen(false));
    dispatch(setSelectedMessage(null));
  };

  return (
    <Transition show={isDeleteMessageModalOpen} as={Fragment}>
      <Dialog
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/80"
        onClose={handleClose}
      >
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80" />
        </Transition.Child>
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-175 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0"
        >
          <Dialog.Panel className="flex w-full min-w-[440px] max-w-[440px] flex-col items-start overflow-hidden rounded bg-dark  shadow">
            <Dialog.Title className="px-4 pt-4 text-xl font-semibold text-white">
              Delete Message
            </Dialog.Title>
            <div className="mt-4 w-full px-4 pb-6 text-d-gray">
              Are you sure you want to delete this message?
              <div className="mt-3 flex w-full items-center rounded border-[0.5px] border-gray-800 bg-dark px-4 py-3 shadow">
                <img
                  src={`https://cdn.discordapp.com/embed/avatars/${
                    parseInt(user?.u_name.split("#")[1]!) % 5
                  }.png`}
                  alt="avatar"
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
                <div className="ml-4 flex flex-col justify-center">
                  <div className="-mt-0.5 flex items-center space-x-2">
                    <h2 className="font-semibold text-d-white">
                      {selectedMessage?.author?.username}
                    </h2>
                    <p className="text-xs text-d-gray first-letter:capitalize">
                      {selectedMessage &&
                        formatRelative(
                          new Date(selectedMessage?.createdAt),
                          new Date()
                        )}
                    </p>
                  </div>
                  <p className="fade-in -mt-1 text-base text-[#dcddde]">
                    {selectedMessage?.content}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-end space-x-2 bg-d-black/60 px-4 py-4">
              <button
                onClick={handleClose}
                className="flex h-10 items-center justify-center rounded border-none px-6 py-2 text-sm font-medium text-white outline-none hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex h-10 items-center justify-center rounded border-none bg-red-500 px-6 py-2 text-sm font-medium text-white outline-none transition ease-in hover:bg-red-600"
              >
                Delete Message
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default DeleteMessageModal;
