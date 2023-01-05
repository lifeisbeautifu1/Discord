import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { passwordReset } from "../features/auth/auth.thunks";
import { setErrors } from "../features/auth/auth";

const ResetPassword: React.FC = () => {
  const { loading, errors, isAuth } = useAppSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (isAuth) navigate("/channels/@me");
  }, [isAuth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) {
      dispatch(
        setErrors({
          password: "Field is required.",
        })
      );
      return;
    }
    if (password.trim().length < 6) {
      dispatch(
        setErrors({
          password: "Must be 6 or more in length.",
        })
      );
      return;
    }
    if (token) {
      dispatch(
        passwordReset({
          password,
          token,
        })
      );
    } else {
      dispatch(
        setErrors({
          token: "Invalid token.",
        })
      );
    }
  };

  return (
    <div className="relative flex h-screen w-screen select-none items-center justify-center">
      <img
        src="/images/bg.svg"
        alt="background"
        className="absolute left-0 top-0 h-screen w-screen"
      />
      <div className="z-10 w-full max-w-[480px] rounded bg-dark p-8 text-white shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <img
            src={
              errors
                ? "/images/reset-password-invalid.svg"
                : "/images/reset-password.svg"
            }
            alt="status"
            className="mb-5 h-[84px]  w-full "
          />
          <h1 className="text-2xl font-semibold">Change your password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col">
            <label
              className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                (errors?.password || errors?.token) && "text-[#f38688]"
              }`}
              htmlFor="password"
            >
              New Password{" "}
              {(errors?.password || errors?.token) && (
                <span className="font-light normal-case italic">
                  {" "}
                  - {errors.password || errors.token}
                </span>
              )}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token}
            className={`mt-5 flex h-12 w-full items-center justify-center rounded bg-brand py-2 font-medium transition ease-in hover:bg-d-brand-hover `}
          >
            {loading ? (
              <BeatLoader size={6} color="white" />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
