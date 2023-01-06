import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectFriendRequestIsModalOpen } from "../../features/friends/friends";
import { setModalOpen } from "../../features/friends/friends";

function FriendRequestModal() {
  const isModalOpen = useAppSelector(selectFriendRequestIsModalOpen);

  const dispatch = useAppDispatch();

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/80"
        onClose={() => dispatch(setModalOpen(false))}
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
          <Dialog.Panel className="flex w-full max-w-[440px] flex-col items-center overflow-hidden rounded bg-dark  text-center shadow">
            <Dialog.Title className="pt-6 font-medium uppercase text-white">
              FRIEND REQUEST FAILED
            </Dialog.Title>
            <Dialog.Description className="mt-4 px-4 pb-4 text-d-gray">
              Hm, didn't work. Double check that the capitalization, spelling,
              any spaces, and numbers are correct.
            </Dialog.Description>
            <div className="w-full bg-d-black/60 px-4 py-4">
              <button
                onClick={() => dispatch(setModalOpen(false))}
                className="flex h-10 w-full items-center justify-center rounded border-none bg-brand px-6 py-2 text-sm font-medium text-white outline-none transition ease-in hover:bg-d-brand-hover"
              >
                Okay
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default FriendRequestModal;
