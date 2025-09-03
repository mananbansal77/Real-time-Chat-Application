import React from "react";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import Login from "./components/Login";
import Regsiter from "./components/Regsiter";
import SearchModel from "./components/SearchModel";
import { auth } from "./Firebase/firebase";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [islogin, setislogin] = useState(false);
  const [user, setuser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const currentuser = auth.currentUser;
    if (currentuser) {
      setuser(currentuser);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setuser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      {user ? (
        <div className="flex lg:flex-row flex-col itmes-start w-[100%]">
          <Navlinks />
          <Chatlist setSelectedUser={setSelectedUser} />
          <Chatbox selectedUser={selectedUser} />
        </div>
      ) : (
        <div>
          {islogin ? (
            <Login islogin={islogin} setislogin={setislogin} />
          ) : (
            <Regsiter islogin={islogin} setislogin={setislogin} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
