import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";
import { useAuthorized } from "../../hooks/useAuthorized";

type Props = {};

const UserPage = (props: Props) => {
  useAuthorized();
  const user = useAppSelector(selectUser);
  return <div>hello, {user?.username}</div>;
};

export default UserPage;
