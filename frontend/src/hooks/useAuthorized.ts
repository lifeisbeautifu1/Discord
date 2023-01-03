import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getMe } from "../features/auth/auth.thunks";

export const useAuthorized = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { loading, isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (!loading && !isAuth) {
      router.replace("/login");
    }
  }, [loading, isAuth, router]);
};
