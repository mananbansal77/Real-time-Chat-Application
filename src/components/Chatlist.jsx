import React, { useEffect, useState, useMemo } from "react";
import { RiMore2Fill } from "react-icons/ri";
import SearchModel from "./SearchModel";
import chatData from "../data/chats";

// helper: format timestamp
const formatDate = (seconds) => {
  if (!seconds) return "N/A";
  const date = new Date(seconds * 1000);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chatlist = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    setChats(chatData);
  }, []);

  // 🔹 Sort chats by lastMessageTimestamp (latest first)
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTime =
        (a.lastMessageTimestamp?.seconds || 0) +
        (a.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      const bTime =
        (b.lastMessageTimestamp?.seconds || 0) +
        (b.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      return bTime - aTime; // descending
    });
  }, [chats]);

  return (
    <section className="relative hidden lg:flex flex-col item-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px] ">
      {/* Profile Header */}
      <header className="flex items-center justify-between w-[100%] lg:border-b border-b-1 p-4 sticky md:static top-0 z-[100]">
        <main className="flex items-center gap-3 ">
          <img
            src="https://i.pravatar.cc/150?img=13"
            className="w-[44px] h-[44px] object-cover rounded-full"
            alt="current-user"
          />
          <span>
            <h3 className="p-0 font-semibold text-[#2a3d39] md:text-[17px]">
              Chatfrik User
            </h3>
            <p className="p-0 font-light text-[#2a3d39] text-[15px]">
              @chatfrik
            </p>
          </span>
        </main>
        <button className="bg-[#d9f2ed] w-[30px] p-2 flex items-center justify-center rounded-lg cursor-pointer">
          <RiMore2Fill color="#01aa85" className="w-[30px] h-[30px]" />
        </button>
      </header>

      {/* Search + Count */}
      <div className="w-[100%] mt-[10px] px-5 pb-0">
        <header className="flex item-center justify-between">
          <h3 className="text-[16px]">Messages ({sortedChats?.length || 0})</h3>
          <SearchModel />
        </header>
      </div>

      {/* Chat list */}
      <main className="flex flex-col items-start mt-[1.0rem] py-3 pt-0">
        {sortedChats?.map((chat) => {
          // get other user (not baxo)
          const otherUser = chat?.users?.find(
            (user) => user?.email !== "baxo@mailinator.com"
          );

          return (
            <button
              key={chat?.id}
              className="flex items-start justify-between w-[100%] border-b border-[#38080822] px-5 pb-3 pt-3 hover:bg-[#f9f9f9] transition"
            >
              {/* Left side: avatar + message */}
              <div className="flex items-start gap-3">
                <img
                  src={otherUser?.image || "https://via.placeholder.com/40"}
                  className="h-[40px] w-[40px] rounded-full object-cover"
                  alt={otherUser?.fullName}
                />
                <span>
                  <h2 className="p-0 font-semibold text-[#2a3d39] text-left text-[16px]">
                    {otherUser?.fullName || "Unknown User"}
                  </h2>
                  <p className="p-0 font-light text-[#2a3d39] text-left text-[14px] truncate max-w-[250px]">
                    {chat?.lastMessage || "No messages yet"}
                  </p>
                </span>
              </div>

              {/* Right side: time */}
              <p className="p-0 font-regular text-gray-400 text-left text-[11px] whitespace-nowrap">
                {formatDate(chat?.lastMessageTimestamp?.seconds)}
              </p>
            </button>
          );
        })}
      </main>
    </section>
  );
};

export default Chatlist;
