import React from "react";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import Login from "./components/Login";
import Regsiter from "./components/Regsiter";
import SearchModel from "./components/SearchModel";

const App = () => {
  return (
    <div>
      {/* <Navlinks />
      <Chatlist />
      <Chatbox /> */}
      <Login />
      {/* <Regsiter /> */}
    </div>
  );
};

export default App;
