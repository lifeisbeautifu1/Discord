import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsEmailModal,
  selectUser,
  setEmailModal,
} from "../../features/auth/auth";

function EmailModal() {
  const isEmailModalOpen = useAppSelector(selectIsEmailModal);

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  return (
    <Transition show={isEmailModalOpen} as={Fragment}>
      <Dialog
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/80"
        onClose={() => dispatch(setEmailModal(false))}
      >
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50" />
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
              Verification email
            </Dialog.Title>
            <Dialog.Description className="mt-4 px-4 pb-4 text-d-gray">
              We have sent you a new verification email to{" "}
              <strong>{user?.email}</strong>, please check both your inbox and
              spam folder.
            </Dialog.Description>
            <div className="w-full bg-d-black/60 px-4 py-4">
              <button
                onClick={() => dispatch(setEmailModal(false))}
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

export default EmailModal;
