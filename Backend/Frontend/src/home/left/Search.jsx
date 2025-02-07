import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../statemanage/useConversation";

const Search = () => {
  const [search, setSearch] = useState("");
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      alert("Please enter a name to search!");
      return;
    }

    // ✅ Search by `name`, ensuring case insensitivity & trimming spaces
    const foundUser = allUsers.find((user) => {
      console.log(`🔍 Checking: ${user?.name} vs ${search}`);
      return user?.name?.trim().toLowerCase() === search.trim().toLowerCase();
    });

    if (foundUser) {
      console.log("✅ User found:", foundUser);
      setSelectedConversation(foundUser);
    } else {
      console.log("❌ User not found:", search);
      alert("User not found!");
    }

    setSearch(""); // Clear input field
  };

  return (
    <div className="h-[12vh]">
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <label className="border-[1px] rounded-lg flex items-center bg-slate-900 gap-2 w-[100%]">
              <input
                type="text"
                className="grow outline-none bg-slate-900 text-white px-2 py-1"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button type="submit">
              <FaSearch className="text-5xl p-2 hover:bg-gray-600 rounded-full duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
