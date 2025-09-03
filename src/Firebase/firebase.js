import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 Use ONLY ONE Firebase config (replace with your project’s correct one)
const firebaseConfig = {
  apiKey: "AIzaSyC8dtCm55QCO0Fvrv0SA3ST5ptjiFj_PE8",
  authDomain: "chat-app-dbded.firebaseapp.com",
  projectId: "chat-app-dbded",
  storageBucket: "chat-app-dbded.appspot.com",
  messagingSenderId: "898816765625",
  appId: "1:898816765625:web:39a017449a2aef1182b568",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//
// 📌 Listen for chats (real-time)
//
export const listenForChats = (setChats) => {
  const chatsRef = collection(db, "chats");

  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const allChats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Guard: ensure user is logged in
    if (!auth.currentUser) {
      setChats([]);
      return;
    }

    // Filter chats where current user is a participant
    const filteredChats = allChats.filter((chat) =>
      chat?.users?.some((user) => user.email === auth.currentUser.email)
    );

    setChats(filteredChats);
  });

  return unsubscribe;
};

//
// 📌 Send message
//
export const sendMessage = async (messageText, chatId, user1, user2) => {
  const chatRef = doc(db, "chats", chatId);

  // fetch user documents
  const user1Doc = await getDoc(doc(db, "users", user1));
  const user2Doc = await getDoc(doc(db, "users", user2));

  const user1Data = user1Doc.data();
  const user2Data = user2Doc.data();

  // check if chat exists, else create
  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      users: [user1Data, user2Data],
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  } else {
    await updateDoc(chatRef, {
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  }

  // add message to subcollection
  const messageRef = collection(db, "chats", chatId, "messages");
  await addDoc(messageRef, {
    text: messageText,
    sender: auth.currentUser.email,
    timestamp: serverTimestamp(),
  });
};

//
// 📌 Listen for messages inside a chat
//
export const listenForMessages = (chatId, setMessages) => {
  const messageRef = collection(db, "chats", chatId, "messages");

  return onSnapshot(messageRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data());
    setMessages(messages);
  });
};

export { auth, db };
