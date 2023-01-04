import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useEffect } from "react";
import { verifyEmail } from "../features/auth/auth.thunks";

const VerifyEmail: React.FC = () => {
  const { isAuth, loading, errors } = useAppSelector((state) => state.auth);

  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token?.trim()) {
      dispatch(verifyEmail(token));
    }
  }, [token]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <img
        src="/images/bg.svg"
        alt="background"
        className="absolute left-0 top-0 h-screen w-screen"
      />
      <div className="z-10 w-full max-w-[484px] rounded bg-dark p-8 text-white shadow-xl">
        <div className="mb-10 flex flex-col items-center">
          <img
            src={
              loading || !token?.trim()
                ? "/images/email-verifying.svg"
                : errors?.token
                ? "/images/email-expired.svg"
                : "/images/email-verified.svg"
            }
            alt="status"
            className="mb-5 h-[100px] max-h-[120px] w-full max-w-[184px]"
          />
          <h1 className="text-2xl font-semibold">
            {loading || !token?.trim()
              ? "Verifying your email"
              : errors?.token
              ? "Email verification link has expired."
              : "Email verified!"}
          </h1>
          <p className="mt-2 text-d-gray">
            {loading || !token?.trim()
              ? "This may take a moment"
              : errors?.token
              ? "Please login and resend the link"
              : ""}
          </p>
        </div>
        <Link to={isAuth ? "/channels/@me" : "/login"}>
          <button
            disabled={loading || !token}
            className={`mt-5 flex h-12 w-full items-center justify-center rounded bg-brand py-2 font-medium transition ease-in hover:bg-d-brand-hover ${
              (loading || !token) && "bg-zinc-600 hover:bg-zinc-600"
            }`}
          >
            {loading || !token ? (
              <BeatLoader size={6} color="white" />
            ) : isAuth ? (
              "Continue to Discord"
            ) : (
              "Log In"
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
