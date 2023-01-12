import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { selectUser, setEmailModal } from "../../features/auth/auth";
import { resendEmailVerification } from "../../features/auth/auth.thunks";

const EmailVerifyPopup = () => {
  const [isVerifyEmail, setIsVerifyEmail] = useState(true);

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const handleClick = () => {
    setIsVerifyEmail(false);

    dispatch(resendEmailVerification());

    dispatch(setEmailModal(true));
  };

  return (
    <div
      className={`hidden ${
        !user?.emailVerified && isVerifyEmail && "!flex"
      } w-full items-center justify-center space-x-2 bg-d-green p-2 text-center font-medium text-white`}
    >
      <p>
        Please check your email and follow the instructions to verify your
        account.
      </p>
      <button
        onClick={handleClick}
        className="rounded border border-white p-0.5 px-2"
      >
        Resend
      </button>
    </div>
  );
};

export default EmailVerifyPopup;
