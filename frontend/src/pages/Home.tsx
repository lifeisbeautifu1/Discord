import { EmailVerifyPopup, SidebarFriends, Tooltip } from "../components";
import { HiChatAlt, HiInbox, HiQuestionMarkCircle } from "react-icons/hi";
import { Tab } from "@headlessui/react";
import { FriendIcon } from "../components/icons";
import { useState } from "react";

const HomePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(4);

  return (
    <div className="flex w-full flex-col">
      <EmailVerifyPopup />
      <div className="flex h-full w-full">
        <SidebarFriends />
        <div className="h-full w-full bg-dark">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <header className="flex h-12 w-full border-b border-d-black px-3.5 shadow">
              <div className="flex h-full items-center space-x-4 divide-x-[0.25px] divide-gray-300/40">
                <div className="flex items-center">
                  <FriendIcon className="mr-2 h-6 w-6 text-d-gray" />
                  <span className="font-semibold text-d-white">Friends</span>
                </div>
                <Tab.List className="flex items-center space-x-4 overflow-hidden pl-4">
                  <Tab className="tab">Online</Tab>
                  <Tab className="tab">All</Tab>
                  <Tab className="tab">Pending</Tab>
                  <Tab className="tab">Blocked</Tab>
                  <Tab className="min-w-max cursor-pointer overflow-hidden rounded border-none bg-d-green py-0.5 px-2  font-medium text-d-white outline-none ui-selected:bg-transparent ui-selected:text-green-500">
                    Add Friend
                  </Tab>
                </Tab.List>
              </div>
              <div className="ml-auto hidden h-full items-center divide-x-[0.25px] divide-gray-300/50 text-d-gray lg:flex">
                <div className="flex items-center justify-center pr-4">
                  <Tooltip position="bottom" text="New Group DM">
                    <HiChatAlt className="h-[25px] w-[25px] cursor-pointer transition hover:text-d-white" />
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-4 pl-4">
                  <Tooltip position="bottom" text="Inbox">
                    <HiInbox className="h-[25px] w-[25px] cursor-pointer transition hover:text-d-white" />
                  </Tooltip>
                  <Tooltip position="bottom" text="Help">
                    <HiQuestionMarkCircle className="h-[25px] w-[25px] cursor-pointer text-green-600" />
                  </Tooltip>
                </div>
              </div>
            </header>
            <main className="flex h-full w-full">
              <Tab.Panels className="h-full w-full lg:flex-[0.7]">
                <Tab.Panel className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-[220px] w-[420px]">
                      <img
                        src="/images/no-friends-online-bg.svg"
                        alt="no friends online right now"
                      />
                    </div>
                    <p className="mt-8 text-[#a3a6aa]">
                      No one's around to play with Wumpus.
                    </p>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-10 h-[168px] w-[376px]">
                      <img src="/images/no-friends-bg.svg" alt="no friends" />
                    </div>
                    <p className="text-[#a3a6aa]">
                      Wumpus is waiting on friends. You don't have to though!
                    </p>
                    <button
                      onClick={() => setSelectedIndex(4)}
                      className="mt-4 rounded bg-brand px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-d-brand-hover"
                    >
                      Add Friend
                    </button>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-[200px] w-[415px]">
                      <img
                        src="/images/no-friends-pending-bg.svg"
                        alt="no friends request pending"
                      />
                    </div>
                    <p className="mt-10 text-[#a3a6aa]">
                      There are no pending friend requests. Here's Wumpus for
                      now
                    </p>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-[232px] w-[432px]">
                      <img
                        src="/images/no-blocked-bg.svg"
                        alt="no friends request pending"
                      />
                    </div>
                    <p className="mt-10 text-[#a3a6aa]">
                      You can't unblock the Wumpus.
                    </p>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="flex h-full w-full items-center justify-center">
                  Friends
                </Tab.Panel>
              </Tab.Panels>
              <div className="hidden h-full border-l-[0.25px] border-gray-600 p-5 py-6 lg:block lg:flex-[0.3]">
                <h2 className="text-xl font-bold text-white">Active Now</h2>
                <div className="mt-6 text-center ">
                  <h3 className="font-semibold text-white">
                    It's quiet for now...
                  </h3>
                  <p className="mt-1 px-4 text-sm leading-[16px] text-d-gray">
                    When a friend starts an activity - like playing a game or
                    hanging out on voice - we'll show it here!
                  </p>
                </div>
              </div>
            </main>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
