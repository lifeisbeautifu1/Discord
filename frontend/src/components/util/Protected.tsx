import { useAppSelector } from "../../app/hooks";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const Protected = ({ children }: Props) => {
  const location = useLocation();
  const { isAuth, loading } = useAppSelector((state) => state.auth);
  return !isAuth && !loading ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <>{children}</>
  );
};

export default Protected;
