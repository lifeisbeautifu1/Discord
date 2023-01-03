import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getMe } from "../features/auth/auth.thunks";

export const useUnathorized = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (isAuth) navigate("/channels/@me");
  }, [isAuth]);
};
