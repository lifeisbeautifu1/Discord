import { useState, FormEvent } from "react";

const AddFriend = () => {
  const [searchTag, setSearchTag] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full border-b border-gray-600 py-5 px-[30px]">
      <h2 className="font-semibold uppercase text-white">ADD FRIEND</h2>
      <p className="mt-2 text-sm text-d-gray">
        You can add a friend with their Discord Tag. It's cAsE sEnSitIvE!
      </p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="flex w-full rounded-lg border border-black bg-d-dark-black px-3 py-2 focus-within:border-blue-500">
          <input
            type="text"
            placeholder="Enter a Username#0000"
            className="flex-1 border-none bg-transparent text-d-white outline-none"
          />
          <button
            type="submit"
            disabled
            className="h-full rounded bg-brand py-1.5 px-4 text-sm text-d-white hover:bg-d-brand-hover disabled:cursor-not-allowed disabled:bg-brand/70"
          >
            Send Friend Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFriend;
