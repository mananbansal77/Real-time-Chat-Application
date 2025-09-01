import React, { useEffect, useMemo, useRef, useState } from "react";
import abc from "../../public/assets/default.jpg";
import { formatTimestamp } from "../utils/FormatTimestamp";
import { RiSendPlaneFill } from "react-icons/ri";
import { messageData } from "../data/messageData";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const senderEmail = "baxo@mailinator.com";

  // sort messages by timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime =
        (a.timestamp?.seconds || 0) + (a.timestamp?.nanoseconds || 0) / 1e9;
      const bTime =
        (b.timestamp?.seconds || 0) + (b.timestamp?.nanoseconds || 0) / 1e9;
      return aTime - bTime;
    });
  }, [messages]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(messageData);
  }, []);

  // Automatic scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  // handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const messageObj = {
      text: newMessage,
      sender: senderEmail,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1e6,
      },
    };
    setMessages((prev) => [...prev, messageObj]);
    setNewMessage("");
  };

  return (
    <section className="flex flex-col items-start justify-start h-screen w-[100%] background-image">
      {/* Chat header */}
      <header className="border-b border-gray-400 w-[100%] h-[82px] md:h-fit p-4 bg-white">
        <main className="flex items-center gap-3">
          <span>
            <img src={abc} className="w-11 h-11 object-cover rounded-full" />
          </span>
          <div className="flex flex-col leading-tight">
            <h3 className="font-semibold text-[#2a3d39] text-lg">
              ChatFrik user
            </h3>
            <p className="font-light text-[#2a3d39] text-sm">@chatfri</p>
          </div>
        </main>
      </header>

      {/* Chat body */}
      <main className="custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between">
        <section className="px-3 pt-5 pb-20 lg:pb-10">
          <div className="overflow-auto h-[80vh]">
            <div className="flex flex-col w-full gap-5">
              {sortedMessages.map((msg, i) => {
                const isSender = msg.sender === senderEmail;
                return isSender ? (
                  // sender message (right aligned)
                  <span
                    key={i}
                    className="flex gap-3 self-end max-w-[70%] me-7"
                  >
                    <div className="h-auto">
                      <div className="flex items-center bg-white justify-center p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-[16px] text-gray-800 break-words">
                          {msg.text}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-xs mt-2 text-right">
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </span>
                ) : (
                  // receiver message (left aligned)
                  <span
                    key={i}
                    className="flex gap-3 w-fit max-w-[70%] self-start"
                  >
                    <img
                      src={abc}
                      alt="user"
                      className="h-9 w-9 object-cover rounded-full"
                    />
                    <div>
                      <div className="flex flex-col bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-gray-800">{msg.text}</h4>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </span>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </section>

        {/* Input box */}
        <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%]">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center bg-white h-[45px] w-[100%] px-2 rounded-lg relative shadow-lg"
          >
            <input
              className="h-full text-[#2a3d39] outline-none text-[16px] pl-3 pr-[50%] rounded-lg w-[100%]"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#d9f2ed] hover:bg-[#c8eae3]"
            >
              <RiSendPlaneFill color="#01aa85" />
            </button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default Chatbox;
