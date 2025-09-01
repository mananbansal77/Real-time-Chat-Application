import React from "react";
import { RiSearchLine } from "react-icons/ri";

const SearchModel = () => {
  return (
    <div>
      <button className="bg-[#d9f2ed] w-[30px] p-2 flex items-center justify-center rounded-lg cursor-pointer">
        <RiSearchLine color="#01aa85" className="w-[18px] h-[18px] " />
      </button>
    </div>
  );
};

export default SearchModel;
