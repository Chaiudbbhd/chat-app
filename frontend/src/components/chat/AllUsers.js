import { useState, useEffect } from "react";
import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
import UserLayout from "../layouts/UserLayout";
import { SearchIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllUsers({
  users = [],
  chatRooms = [],
  setChatRooms,
  onlineUsersId = [],
  currentUser,
  changeChat,
}) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [nonContacts, setNonContacts] = useState([]);
  const [filteredNonContacts, setFilteredNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);

  useEffect(() => {
    if (!Array.isArray(chatRooms)) return;
    const ids = chatRooms.map((chatRoom) => {
      return chatRoom.members.find((member) => member !== currentUser.uid);
    });
    setContactIds(ids);
  }, [chatRooms, currentUser.uid]);

  useEffect(() => {
    if (!Array.isArray(users)) return;
    const nonContactsList = users.filter(
      (f) => f.uid !== currentUser.uid && !contactIds.includes(f.uid)
    );
    setNonContacts(nonContactsList);
    setFilteredNonContacts(nonContactsList); // initialize search results
  }, [contactIds, users, currentUser.uid]);

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  const handleNewChatRoom = async (user) => {
    const members = {
      senderId: currentUser.uid,
      receiverId: user.uid,
    };
    const res = await createChatRoom(members);
    setChatRooms((prev) => [...prev, res]);
    changeChat(res);
  };

  const handleSearch = (query) => {
    const searchText = query.toLowerCase();
    const filtered = nonContacts.filter((user) =>
      user.name?.toLowerCase().includes(searchText)
    );
    setFilteredNonContacts(filtered);
  };

  return (
    <>
      {/* Embedded search input */}
      <div className="mx-3 my-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
            <SearchIcon
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            name="search"
            className="block py-2 pl-10 pr-3 w-full bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Search"
            type="search"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <ul className="overflow-auto h-[30rem]">
        <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Chats</h2>
        <li>
          {(chatRooms || []).map((chatRoom, index) => (
            <div
              key={chatRoom.id || index}
              className={classNames(
                index === selectedChat
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "transition duration-150 ease-in-out cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700",
                "flex items-center px-3 py-2 text-sm "
              )}
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <Contact
                chatRoom={chatRoom}
                onlineUsersId={onlineUsersId}
                currentUser={currentUser}
              />
            </div>
          ))}
        </li>

        <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">
          Other Users
        </h2>
        <li>
          {(filteredNonContacts || []).map((nonContact, index) => (
            <div
              key={nonContact.uid || index}
              className="flex items-center px-3 py-2 text-sm bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNewChatRoom(nonContact)}
            >
              <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
            </div>
          ))}
        </li>
      </ul>
    </>
  );
}
