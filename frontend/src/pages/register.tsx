import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { BsCheck2 } from "react-icons/bs";
import { register } from "../features/auth/auth.thunks";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BeatLoader } from "react-spinners";
import { useSocketContext } from "../contexts/SocketContext";

const Register: React.FC = () => {
  const [sendEmails, setSendEmails] = useState(true);

  const { errors, loading, isAuth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const socket = useSocketContext();

  useEffect(() => {
    if (isAuth) {
      socket.connect();

      navigate("/channels/@me");
    }
  }, [isAuth]);

  return (
    <div className="flex h-screen w-screen select-none items-center justify-center px-2">
      <img
        src="/images/bg.svg"
        className="absolute left-0 top-0 h-screen w-screen"
      />
      <div className="drop z-10 w-full max-w-[478px] rounded bg-dark p-8 text-white shadow-xl">
        <div className="flex w-full flex-col items-center">
          <h1 className="mb-2 text-2xl font-semibold">Create an account</h1>
          <Formik
            initialValues={{ email: "", password: "", username: "" }}
            onSubmit={(values) => {
              dispatch(register(values));
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
                    Email
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
                    className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label
                    className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                      errors?.username && touched.username && "text-[#f38688]"
                    }`}
                    htmlFor="username"
                  >
                    Username
                    {errors?.username && touched.username && (
                      <span className="font-light normal-case italic">
                        {" "}
                        - {errors.username}
                      </span>
                    )}
                  </label>
                  <input
                    value={values.username}
                    onChange={handleChange}
                    required
                    type="username"
                    name="username"
                    id="username"
                    className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label
                    className={`mb-2 text-xs font-bold uppercase tracking-[0.02em] text-d-gray ${
                      errors?.password && touched.password && "text-[#f38688]"
                    }`}
                    htmlFor="password"
                  >
                    Password
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
                    className="h-10 w-full rounded border-none bg-d-dark-black p-2.5 outline-none"
                  />
                </div>
                <div
                  className="mt-3 flex cursor-pointer items-center text-xs text-d-gray"
                  onClick={() => setSendEmails(!sendEmails)}
                >
                  <div
                    className={`mr-2 rounded-lg border border-d-gray p-1 ${
                      sendEmails && "bg-brand"
                    }`}
                  >
                    <BsCheck2
                      className={`text-lg text-white opacity-0 ${
                        sendEmails && "opacity-100"
                      }`}
                    />
                  </div>
                  <p>
                    (Optional) It's okay to send me emails with Discord updates,
                    tips and special offers. You can opt out at any time.
                  </p>
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full rounded bg-brand py-2 font-medium transition ease-in hover:bg-d-brand-hover"
                >
                  {loading ? <BeatLoader size={8} color="white" /> : "Continue"}
                </button>

                <Link
                  className="mt-1.5 mb-5 inline-block p-1 text-sm text-d-blue hover:underline"
                  to="/login"
                >
                  Already have an account?
                </Link>
                <p className="text-xs text-d-gray">
                  By registering, you agree to Discord's{" "}
                  <Link to="/" className="text-d-blue hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/" className="text-d-blue hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
