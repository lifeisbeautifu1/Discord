import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../features/auth/auth.thunks";

export const useAuthorized = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { loading, isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate("/login");
    }
  }, [loading, isAuth, navigate]);
};
