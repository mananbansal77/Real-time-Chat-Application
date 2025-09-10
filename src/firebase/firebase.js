import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment, // 👈 1. Import 'increment'
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8dtCm55QCO0Fvrv0SA3ST5ptjiFj_PE8",
  authDomain: "chat-app-dbded.firebaseapp.com",
  projectId: "chat-app-dbded",
  storageBucket: "chat-app-dbded.firebasestorage.app",
  messagingSenderId: "898816765625",
  appId: "1:898816765625:web:39a017449a2aef1182b568",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const listenForChats = (setChats) => {
  const chatsRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredChats = chatList.filter((chat) =>
      chat?.users?.some((user) => user.email === auth.currentUser.email)
    );

    setChats(filteredChats);
  });

  return unsubscribe;
};

// 👇 2. The sendMessage function is updated
export const sendMessage = async (
  messageText,
  chatId,
  senderId,
  receiverId
) => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  // Create the new message in the 'messages' sub-collection
  const messageRef = collection(db, "chats", chatId, "messages");
  await addDoc(messageRef, {
    text: messageText,
    sender: auth.currentUser.email,
    senderId: senderId,
    receiverId: receiverId,
    isRead: false,
    timestamp: serverTimestamp(),
  });

  // Update the main chat document
  if (chatDoc.exists()) {
    // If chat already exists, update the last message and increment unread count
    await updateDoc(chatRef, {
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
      // Use dot notation to increment the count for the receiver
      [`unreadCount.${receiverId}`]: increment(1),
    });
  } else {
    // If this is the first message, create the chat document
    const user1Doc = await getDoc(doc(db, "users", senderId));
    const user2Doc = await getDoc(doc(db, "users", receiverId));

    await setDoc(chatRef, {
      users: [user1Doc.data(), user2Doc.data()],
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
      // Initialize the unread count map
      unreadCount: {
        [senderId]: 0,
        [receiverId]: 1,
      },
    });
  }
};

export const listenForMessages = (chatId, setMessages) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data());
    setMessages(messages);
  });
};

export { auth, db };
