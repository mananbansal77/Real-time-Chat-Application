import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = ({ islogin, setislogin }) => {
  const [userdata, setuserdata] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlechangeuserdata = (e) => {
    const { name, value } = e.target;
    setuserdata((prevstate) => ({
      ...prevstate,
      [name]: value,
    }));
  };

  const handleauth = async () => {
    setIsLoading(true);
    try {
      const usercredential = await createUserWithEmailAndPassword(
        auth,
        userdata?.email,
        userdata?.password
      );

      const user = usercredential.user;
      const userdocref = doc(db, "users", user.uid);

      await setDoc(userdocref, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split("@")[0],
        fullName: userdata.fullName,
        image: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-[100vh] background-image">
      <div className="bg-white shadow-lg p-5 rounded-xl h-[25rem] w-[20rem] flex flex-col justify-center items-center">
        <div className="mb-10">
          <h1 className="text-center text-[28px] font-bold">Sign Up</h1>
          <p className="text-center text-sm text-gray-400">
            Welcome, create an account to continue
          </p>
        </div>

        <div className="w-full">
          <input
            name="fullName"
            type="text"
            onChange={handlechangeuserdata}
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Full Name"
          />
          <input
            name="email"
            type="email"
            onChange={handlechangeuserdata}
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            onChange={handlechangeuserdata}
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Password"
          />
        </div>

        <div className="w-full">
          <button
            onClick={handleauth}
            disabled={isLoading}
            className="bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                Register <FaUserPlus />
              </>
            )}
          </button>
        </div>

        <div className="mt-5 text-center text-gray-400 text-sm">
          <button onClick={() => setislogin(!islogin)}>
            Already have an Account? Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
