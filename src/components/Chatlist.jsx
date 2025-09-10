import React, { useState, useEffect, useMemo } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiMore2Fill } from "react-icons/ri";
import SearchModal from "./SearchModal";
import { formatTimestamp } from "../utils/formatTimestamp";
import { auth, db, listenForChats } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Chatlist = ({ setSelectedUser }) => {
  // ... (your existing state and logic)
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        setUser(doc.data());
      });
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = listenForChats(setChats);
      return () => unsubscribe();
    }
  }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTimestamp =
        a?.lastMessageTimestamp?.seconds +
        (a?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      const bTimestamp =
        b?.lastMessageTimestamp?.seconds +
        (b?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      return bTimestamp - aTimestamp;
    });
  }, [chats]);

  const startChat = (otherUser, chatId) => {
    setSelectedUser(otherUser);
    const chatRef = doc(db, "chats", chatId);
    updateDoc(chatRef, {
      [`unreadCount.${auth.currentUser.uid}`]: 0,
    });
  };

  return (
    // 👇 Removed `hidden lg:flex` to be controlled by App.jsx. Set width to full.
    <section className="flex flex-col item-start justify-start bg-white h-screen w-full lg:max-w-[400px] lg:border-r border-gray-200">
      <header className="flex items-center justify-between w-full p-4 sticky top-0 z-10 bg-white border-b">
        {/* ... header content ... */}
        <main className="flex items-center gap-3">
          <img
            src={user?.image || defaultAvatar}
            className="w-[44px] h-[44px] object-cover rounded-full"
            alt=""
          />
          <span>
            <h3 className="p-0 font-semibold text-[#2A3D39] md:text-[17px]">
              {user?.fullName || "ChatFrik user"}
            </h3>
            <p className="p-0 font-light text-[#2A3D39] text-[15px]">
              @{user?.username || "chatfrik"}
            </p>
          </span>
        </main>
        <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
          <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
        </button>
      </header>
      <div className="w-full mt-4 px-5">
        <header className="flex items-center justify-between">
          <h3 className="text-[16px]">Messages ({chats?.length || 0})</h3>
          <SearchModal startChat={(user) => setSelectedUser(user)} />
        </header>
      </div>

      {/* 👇 Added padding-bottom (pb-20) to make space for the nav bar */}
      <main className="flex flex-col items-start mt-4 pb-20 custom-scrollbar w-full h-full overflow-y-auto">
        {sortedChats?.map((chat) => {
          const otherUser = chat?.users?.find(
            (user) => user?.email !== auth?.currentUser?.email
          );
          const unreadMessages = chat.unreadCount?.[auth.currentUser.uid] || 0;
          if (!otherUser) return null;

          return (
            <button
              key={chat.id}
              onClick={() => startChat(otherUser, chat.id)}
              className="flex items-center justify-between w-full border-b border-gray-200 px-5 py-3 text-left hover:bg-gray-50"
            >
              {/* ... your existing button content ... */}
              <div className="flex items-center gap-3">
                <img
                  src={otherUser?.image || defaultAvatar}
                  className="h-[40px] w-[40px] rounded-full object-cover"
                  alt=""
                />
                <div className="flex-1">
                  <h2 className="p-0 font-semibold text-[#2A3d39] text-[17px]">
                    {otherUser?.fullName || "ChatFrik User"}
                  </h2>
                  <p
                    className={`p-0 text-[14px] truncate max-w-[250px] ${
                      unreadMessages > 0
                        ? "font-bold text-black"
                        : "font-light text-gray-500"
                    }`}
                  >
                    {chat?.lastMessage}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full min-w-[55px]">
                <p className="p-0 font-regular text-gray-400 text-[11px]">
                  {formatTimestamp(chat?.lastMessageTimestamp)}
                </p>
                {unreadMessages > 0 ? (
                  <span className="bg-[#01AA85] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-1">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                ) : (
                  <div className="h-5 w-5 mt-1"></div>
                )}
              </div>
            </button>
          );
        })}
      </main>
    </section>
  );
};

export default Chatlist;
