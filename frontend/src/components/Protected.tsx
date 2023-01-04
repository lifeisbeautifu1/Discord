import { useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const Protected = ({ children }: Props) => {
  const { isAuth, loading } = useAppSelector((state) => state.auth);
  return !isAuth && !loading ? <Navigate to="/login" /> : <>{children}</>;
};

export default Protected;
