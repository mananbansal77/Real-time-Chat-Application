import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import { auth } from "./firebase/firebase";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // This sets up a listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // If no user is logged in, show the Login/Register forms
  if (!user) {
    return (
      <div>
        {isLogin ? (
          <Login isLogin={isLogin} setIsLogin={setIsLogin} />
        ) : (
          <Register isLogin={isLogin} setIsLogin={setIsLogin} />
        )}
      </div>
    );
  }

  // If a user is logged in, show the main chat application
  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      <Navlinks />

      {/* Desktop Layout: Always show both list and chatbox */}
      <div className="hidden lg:flex w-full">
        <Chatlist setSelectedUser={setSelectedUser} />
        <Chatbox
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Mobile Layout: Show one view at a time based on selectedUser state */}
      <div className="flex lg:hidden w-full h-full">
        {selectedUser ? (
          // If a user is selected, show the chatbox
          <Chatbox
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        ) : (
          // Otherwise, show the list of chats
          <Chatlist setSelectedUser={setSelectedUser} />
        )}
      </div>
    </div>
  );
};

export default App;
