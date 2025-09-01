import React from "react";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import Login from "./components/Login";
import Regsiter from "./components/Regsiter";
import SearchModel from "./components/SearchModel";

const App = () => {
  return (
    <div className="flex lg:flex-row flex-col itmes-start w-[100%]">
      <Navlinks />
      <Chatlist />
      <Chatbox />
      {/* <Login /> */}
      {/* <Regsiter /> */}
    </div>
  );
};

export default App;
