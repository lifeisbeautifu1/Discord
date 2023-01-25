import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIsAuth } from "../features/auth/auth";
import { getMe } from "../features/auth/auth.thunks";
import {
  getConversations,
  getNotifications,
} from "../features/conversations/conversations.thunks";
import {
  getFriendRequests,
  getFriends,
} from "../features/friends/friends.thunks";

export function useGetInitialData() {
  const isAuth = useAppSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(getFriendRequests());
      dispatch(getFriends());
      dispatch(getConversations());
      dispatch(getNotifications());
    }
  }, [isAuth]);
}
