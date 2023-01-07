import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BeatLoader } from "react-spinners";
import { login, passwordEmail } from "../features/auth/auth.thunks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { setErrors } from "../features/auth/auth";
import { AuthModal } from "../components";
import { useSocketContext } from "../contexts/SocketContext";

const Login: React.FC = () => {
  const { errors, loading, isAuth, isAuthModalOpen } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const socket = useSocketContext();

  const location = useLocation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      socket.connect();
      if (location?.state?.from?.pathname) {
        navigate(location.state.from.pathname);
      } else {
        navigate("/channels/@me");
      }
    }
  }, [isAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const forgotPassword = () => {
    if (!formData.email.trim()) {
      dispatch(
        setErrors({
          email: "This field is required",
        })
      );
      return;
    }
    dispatch(passwordEmail(formData.email));
  };

  return (
    <div className="flex h-screen w-screen select-none items-center justify-center px-2">
      {isAuthModalOpen && <AuthModal />}
      <img
        src="/images/bg.svg"
        className="absolute left-0 top-0 h-screen w-screen"
      />
      <div className="drop z-10 flex w-full max-w-[424px] gap-10 rounded bg-dark p-8 text-white shadow-xl md:max-w-[784px]">
        <div className="flex w-full !max-w-[420px] shrink-0 flex-col items-center">
          <h1 className="mb-2 text-2xl font-semibold">Welcome back!</h1>
          <p className="text-d-gray">We're so excited to see you again!</p>

          <form onSubmit={handleSubmit} className="mt-5 w-full">
            <div className="flex flex-col">
              <label
                className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                  errors?.email && "text-[#f38688]"
                }`}
                htmlFor="email"
              >
                Email{" "}
                {!errors?.email && <span className="text-[#ed4245]">*</span>}
                {errors?.email && (
                  <span className="font-light normal-case italic">
                    {" "}
                    - {errors.email}
                  </span>
                )}
              </label>
              <input
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                name="email"
                id="email"
                className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label
                className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                  errors?.password && "text-[#f38688]"
                }`}
                htmlFor="password"
              >
                Password{" "}
                {!errors?.password && <span className="text-[#ed4245]">*</span>}
                {errors?.password && (
                  <span className="font-light normal-case italic">
                    {" "}
                    - {errors.password}
                  </span>
                )}
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                type="password"
                name="password"
                id="password"
                className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={forgotPassword}
              className="mt-1 mb-4 p-1 text-sm text-d-blue hover:underline"
            >
              Forgot your password?
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center rounded bg-brand py-2 font-medium transition ease-in hover:bg-d-brand-hover"
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Log In"}
            </button>
            <p className="mt-2.5 text-sm text-d-gray">
              Need an account?{" "}
              <Link className="text-d-blue hover:underline" to="/register">
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="ml-auto mt-6 hidden w-full max-w-[240px] shrink-0 flex-col items-center md:flex">
          <div className="relative rounded bg-white p-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/qr-logo.png"
                width={50}
                height={50}
                alt="logo"
              />
            </div>
            <img
              src="/images/qr-code.png"
              width={160}
              height={160}
              alt="qr-code"
            />
          </div>
          <h1 className="mb-2 mt-8 text-2xl font-semibold">
            Login with QR Code
          </h1>
          <p className="w-full text-center text-d-gray">
            Scan this with{" "}
            <span className="font-semibold">Discord mobile app</span> to log in
            instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
