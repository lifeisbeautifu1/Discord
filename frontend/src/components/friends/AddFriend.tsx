import { useState, FormEvent, useRef, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { reset } from "../../features/friends/friends";
import { sendFriendRequest } from "../../features/friends/friends.thunks";

const AddFriend = () => {
  const [searchTag, setSearchTag] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { error, success, u_name } = useAppSelector((state) => state.friends);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    inputRef?.current?.blur();

    dispatch(sendFriendRequest(searchTag));
  };

  useEffect(() => {
    dispatch(reset());
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTag(e.target.value);

    if (error || success) dispatch(reset());
  };

  return (
    <div className="w-full border-b border-gray-600 py-5 px-[30px]">
      <h2 className="font-semibold uppercase text-white">ADD FRIEND</h2>
      <p className="mt-2 text-sm text-d-gray">
        You can add a friend with their Discord Tag. It's cAsE sEnSitIvE!
      </p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div
          className={`flex w-full rounded-lg border border-black bg-d-dark-black px-3 py-2 focus-within:border-blue-500 ${
            success && "!border-green-500"
          } ${error && "!border-red-500"}`}
        >
          <input
            type="text"
            ref={inputRef}
            value={searchTag}
            onChange={handleChange}
            placeholder="Enter a Username#0000"
            className="flex-1 border-none bg-transparent text-d-white shadow-inner outline-none"
          />
          <button
            type="submit"
            disabled={!searchTag.match(/^\w{3,}#\d{4}$/)}
            className="h-full rounded bg-brand py-1.5 px-4 text-sm text-d-white disabled:cursor-not-allowed disabled:bg-brand/70 hover:bg-d-brand-hover"
          >
            Send Friend Request
          </button>
        </div>
        {success && (
          <p className="mt-2 text-sm text-green-500">
            Success! Your friend request to{" "}
            <span className="font-semibold">{u_name}</span> was sent.
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">
            Hm, didn't work. Double check that the capitalization, spelling, any
            spaces, and numbers are correct.
          </p>
        )}
      </form>
    </div>
  );
};

export default AddFriend;
