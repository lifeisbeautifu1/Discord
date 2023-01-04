import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BeatLoader } from "react-spinners";
import { login } from "../features/auth/auth.thunks";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login: React.FC = () => {
  const { errors, loading, isAuth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/channels/@me");
  }, [isAuth]);

  return (
    <div className="flex h-screen w-screen select-none items-center justify-center px-2">
      <img
        src="/images/bg.svg"
        className="absolute left-0 top-0 h-screen w-screen"
      />
      <div className="drop z-10 flex w-full max-w-[424px] gap-10 rounded bg-dark p-8 text-white shadow-xl md:max-w-[784px]">
        <div className="flex w-full !max-w-[420px] shrink-0 flex-col items-center">
          <h1 className="mb-2 text-2xl font-semibold">Welcome back!</h1>
          <p className="text-d-gray">We're so excited to see you again!</p>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              dispatch(login(values));
            }}
          >
            {({ values, touched, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="mt-5 w-full">
                <div className="flex flex-col">
                  <label
                    className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                      errors?.email && touched.email && "text-[#f38688]"
                    }`}
                    htmlFor="email"
                  >
                    Email{" "}
                    {!errors?.email && !touched.email && (
                      <span className="text-[#ed4245]">*</span>
                    )}
                    {errors?.email && touched.email && (
                      <span className="font-light normal-case italic">
                        {" "}
                        - {errors.email}
                      </span>
                    )}
                  </label>
                  <input
                    value={values.email}
                    onChange={handleChange}
                    required
                    type="email"
                    name="email"
                    id="email"
                    className="h-10 w-full rounded border-none bg-d-input-black p-2.5 outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label
                    className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                      errors?.password && touched.password && "text-[#f38688]"
                    }`}
                    htmlFor="password"
                  >
                    Password{" "}
                    {!errors?.password && !touched.password && (
                      <span className="text-[#ed4245]">*</span>
                    )}
                    {errors?.password && touched.password && (
                      <span className="font-light normal-case italic">
                        {" "}
                        - {errors.password}
                      </span>
                    )}
                  </label>
                  <input
                    value={values.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    type="password"
                    name="password"
                    id="password"
                    className="h-10 w-full rounded border-none bg-d-input-black p-2.5 outline-none"
                  />
                </div>
                <Link
                  className="mt-1 mb-5 p-1 text-sm text-d-blue hover:underline"
                  to="/"
                >
                  Forgot your password?
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex h-10 w-full items-center justify-center rounded bg-brand py-2 font-medium transition ease-in hover:bg-d-brand-hover"
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
            )}
          </Formik>
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
