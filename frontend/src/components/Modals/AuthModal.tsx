import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { motion } from "framer-motion";
import { setAuthModal } from "../../features/auth/auth";

const AuthModal: React.FC = () => {
  const { modalEmail } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => dispatch(setAuthModal(false))}
      className={`absolute inset-0 z-20 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/60`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] overflow-hidden rounded bg-dark"
      >
        <h1 className="p-4 pb-0 text-xl font-semibold text-white">
          Instructions Sent
        </h1>
        <p className="p-4 leading-[20px] text-d-gray">
          We sent instructions to change your password to{" "}
          <strong>{modalEmail}</strong>, please check both your inbox and spam
          folder.
        </p>
        <div className="flex items-center justify-end bg-[#2f3136] p-4">
          <button
            onClick={() => dispatch(setAuthModal(false))}
            className="flex h-10 items-center justify-center rounded bg-brand px-6 py-2 text-sm font-medium text-white transition ease-in hover:bg-d-brand-hover"
          >
            Okay
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
