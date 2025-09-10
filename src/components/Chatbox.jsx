import React, { useEffect, useMemo, useRef, useState } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { formatTimestamp } from "../utils/formatTimestamp";
import { RiSendPlaneFill } from "react-icons/ri";
import { auth, db, listenForMessages, sendMessage } from "../firebase/firebase"; // 👈 1. Import db
import { doc, updateDoc } from "firebase/firestore"; // 👈 2. Import firestore functions
import logo from "../../public/assets/logo.png";

const Chatbox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const senderEmail = auth?.currentUser?.email;
  const messagesEndRef = useRef(null);

  // Effect for listening to messages AND resetting unread count
  useEffect(() => {
    if (selectedUser?.uid) {
      const chatId =
        auth.currentUser.uid < selectedUser.uid
          ? `${auth.currentUser.uid}-${selectedUser.uid}`
          : `${selectedUser.uid}-${auth.currentUser.uid}`;

      // 👇 3. This new code resets the unread count to 0
      const chatRef = doc(db, "chats", chatId);
      updateDoc(chatRef, {
        [`unreadCount.${auth.currentUser.uid}`]: 0,
      });

      // Start listening for new messages
      const unsubscribe = listenForMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [selectedUser]);

  // Effect for smooth-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTimestamp =
        a?.timestamp?.seconds + (a?.timestamp?.nanoseconds || 0) / 1e9;
      const bTimestamp =
        b?.timestamp?.seconds + (b?.timestamp?.nanoseconds || 0) / 1e9;
      return aTimestamp - bTimestamp;
    });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const chatId =
      auth.currentUser.uid < selectedUser.uid
        ? `${auth.currentUser.uid}-${selectedUser.uid}`
        : `${selectedUser.uid}-${auth.currentUser.uid}`;

    // The sendMessage function now correctly passes sender and receiver IDs
    await sendMessage(
      messageText,
      chatId,
      auth.currentUser.uid, // senderId
      selectedUser.uid // receiverId
    );
    setMessageText("");
  };

  return (
    <>
      {selectedUser ? (
        <section className="flex flex-col items-start justify-start h-screen w-[100%] background-image">
          <header className="w-[100%] h-[82px] m:h-fit p-4 bg-white">
            <main className="flex items-center gap-3">
              <span>
                <img
                  src={selectedUser?.image || defaultAvatar}
                  className="w-11 h-11 object-cover rounded-full"
                  alt=""
                />
              </span>
              <span>
                <h3 className="font-semibold text-[#2A3D39] text-lg">
                  {selectedUser?.fullName || "Chatfrik User"}
                </h3>
                <p className="font-light text-[#2A3D39] text-sm">
                  @{selectedUser?.username || "chatfrik"}
                </p>
              </span>
            </main>
          </header>

          <main className="custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between">
            <section className="px-3 pt-5 b-20 lg:pb-10">
              <div className="overflow-auto h-[80vh]">
                {sortedMessages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col w-full my-2 ${
                      msg?.sender === senderEmail ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 h-auto ${
                        msg?.sender === senderEmail
                          ? "me-2 md:me-10 flex-row-reverse"
                          : "ms-2 md:ms-10"
                      }`}
                    >
                      <img
                        src={
                          msg?.sender === senderEmail
                            ? auth.currentUser?.photoURL || defaultAvatar
                            : selectedUser?.image || defaultAvatar
                        }
                        className="h-11 w-11 object-cover rounded-full"
                        alt=""
                      />
                      <div>
                        <div className="flex items-center bg-white justify-center p-3 md:p-4 rounded-lg shadow-sm max-w-xs md:max-w-md">
                          <h4 className="break-words">{msg.text}</h4>
                        </div>
                        <p
                          className={`text-gray-400 text-xs mt-2 ${
                            msg?.sender === senderEmail
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {formatTimestamp(msg?.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </section>
            <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%]">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center bg-white h-[45px] w-[100%] px-2 rounded-lg relative shadow-lg"
              >
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="h-full text-[#2A3D39] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-[100%]"
                  type="text"
                  placeholder="Write your message..."
                />
                <button
                  type="submit"
                  className="flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#D9f2ed] hover:bg-[#c8eae3]"
                >
                  <RiSendPlaneFill color="#01AA85" />
                </button>
              </form>
            </div>
          </main>
        </section>
      ) : (
        <section className="h-screen w-[100%] bg-[#e5f6f3]">
          <div className="flex flex-col justify-center items-center h-[100vh]">
            <img src={logo} alt="" width={100} />
            <h1 className="text-[30px] font-bold text-teal-700 mt-5">
              Welcome to Chatfrik
            </h1>
            <p className="text-gray-500">
              Connect and chat with friends easily, securely, fast and free
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default Chatbox;
