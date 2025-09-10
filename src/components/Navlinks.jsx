import React from "react";
import logo from "../../public/assets/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
  RiBardLine,
  RiChatAiLine,
  RiFile4Line,
  RiFolderUserLine,
  RiNotificationLine,
  RiShutDownLine,
} from "react-icons/ri";

const Navlinks = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="fixed bottom-0 lg:static z-20 flex items-center h-[7vh] lg:h-screen w-full lg:w-[150px] py-8 lg:py-0 bg-[#01AA85] border-t lg:border-t-0 lg:border-r border-gray-200/20">
      {/* 👇 Changed `lg:justify-start` to align items to the top on desktop */}
      <main className="flex flex-row lg:flex-col items-center lg:gap-10 justify-around lg:justify-start w-full h-full">
        <div className="hidden lg:flex items-start justify-center lg:border-b border-b-1 border-[#ffffffb9] lg:w-[100%] p-4">
          <span className="flex items-center justify-center">
            <img
              src={logo}
              className="w-[56px] h-[52px] object-contain bg-white rounded-lg p-2"
              alt=""
            />
          </span>
        </div>

        <ul className="flex flex-row lg:flex-col items-center justify-around w-full lg:w-auto gap-7 md:gap-10 px-2 md:px-0">
          <li>
            <button className="lg:text-[28px] text-[22px] cursor-pointer">
              <RiChatAiLine color="#fff" />
            </button>
          </li>
          <li>
            <button className="lg:text-[28px] text-[22px] cursor-pointer">
              <RiFolderUserLine color="#fff" />
            </button>
          </li>
          <li>
            <button className="lg:text-[28px] text-[22px] cursor-pointer">
              <RiNotificationLine color="#fff" />
            </button>
          </li>
          <li>
            <button className="lg:text-[28px] text-[22px] cursor-pointer">
              <RiFile4Line color="#fff" />
            </button>
          </li>
          <li>
            <button className="lg:text-[28px] text-[22px] cursor-pointer">
              <RiBardLine color="#fff" />
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="lg:text-[28px] text-[22px] cursor-pointer"
            >
              <RiShutDownLine color="#fff" />
            </button>
          </li>
        </ul>
      </main>
    </section>
  );
};

export default Navlinks;
