import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getMe } from "../features/auth/auth.thunks";

export const useUnathorized = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (isAuth) router.push("/channels/@me");
  }, [isAuth]);
};
