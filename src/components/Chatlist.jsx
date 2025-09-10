import React, { useState, useEffect, useMemo } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiMore2Fill } from "react-icons/ri";
import SearchModal from "./SearchModal";
import { formatTimestamp } from "../utils/formatTimestamp";
import { auth, db, listenForChats } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; // 👈 Import updateDoc

const Chatlist = ({ setSelectedUser }) => {
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

    // 👇 Reset the unread count in Firestore when a chat is opened
    const chatRef = doc(db, "chats", chatId);
    updateDoc(chatRef, {
      [`unreadCount.${auth.currentUser.uid}`]: 0,
    });
  };

  return (
    <section className="relative hidden lg:flex flex-col item-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px] ">
      <header className="flex items-center justify-between w-[100%] lg:border-b border-b-1 border-[#898989b9] p-4 sticky md:static top-0 z-[100] border-r border-[#9090902c]">
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
      <div className="w-[100%] mt-[10px] px-5">
        <header className="flex items-center justify-between">
          <h3 className="text-[16px]">Messages ({chats?.length || 0})</h3>
          <SearchModal startChat={(user) => setSelectedUser(user)} />
        </header>
      </div>

      <main className="flex flex-col items-start mt-[1.5rem] pb-3 custom-scrollbar w-[100%] h-[100%]">
        {sortedChats?.map((chat) => {
          const otherUser = chat?.users?.find(
            (user) => user?.email !== auth?.currentUser?.email
          );

          // 👇 Get the unread count for the current logged-in user
          const unreadMessages = chat.unreadCount?.[auth.currentUser.uid] || 0;

          if (!otherUser) return null;

          return (
            <button
              key={chat.id}
              onClick={() => startChat(otherUser, chat.id)} // Pass chat.id to reset count
              className="flex items-center justify-between w-[100%] border-b border-[#9090902c] px-5 py-3 text-left"
            >
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
                  {/* 👇 Conditionally style the last message */}
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
                {/* 👇 This is the new Unread Message Badge */}
                {unreadMessages > 0 ? (
                  <span className="bg-[#01AA85] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-1">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                ) : (
                  <div className="h-5 w-5 mt-1"></div> // Placeholder for alignment
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
