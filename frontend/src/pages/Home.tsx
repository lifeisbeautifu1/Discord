import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/auth";
import { logout } from "../features/auth/auth.thunks";

type Props = {};

const UserPage = (props: Props) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  return (
    <div>
      <p>hello, {user?.username}</p>
      <div>
        <button onClick={() => dispatch(logout())}>logout</button>
      </div>
    </div>
  );
};

export default UserPage;
