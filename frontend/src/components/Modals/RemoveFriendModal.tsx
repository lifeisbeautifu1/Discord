import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";
import {
  setFriendToDelete,
  setRemoveFriendModal,
} from "../../features/friends/friends";
import { deleteFriend } from "../../features/friends/friends.thunks";

function RemoveFriendModal() {
  const { isRemoveFriendModal, friendToDelete } = useAppSelector(
    (state) => state.friends
  );

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setRemoveFriendModal(false));
    dispatch(setFriendToDelete(null));
  };

  const handleDelete = () => {
    if (friendToDelete) dispatch(deleteFriend(friendToDelete.id));
    dispatch(setRemoveFriendModal(false));
    dispatch(setFriendToDelete(null));
  };

  const username =
    friendToDelete?.sender?.id === user?.id
      ? friendToDelete?.receiver?.username
      : friendToDelete?.sender?.username;

  return (
    <Transition show={isRemoveFriendModal} as={Fragment}>
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
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-175 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0"
        >
          <Dialog.Panel className="flex w-full max-w-[440px] flex-col items-start overflow-hidden rounded bg-dark  shadow">
            <Dialog.Title className="px-4 pt-4 text-xl font-bold text-white">
              Remove '{username}'
            </Dialog.Title>
            <Dialog.Description className="mt-4 px-4 pb-6 text-d-white">
              Are you sure you want permanently remove{" "}
              <strong>{username}</strong> from your friends?
            </Dialog.Description>
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
                Remove Friend
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default RemoveFriendModal;
