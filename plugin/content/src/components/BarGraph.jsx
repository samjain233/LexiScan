import React, { useEffect, useState } from "react";
import { CgInsertAfterR } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { VscVmActive } from "react-icons/vsc";

const BarGraph = ({ tab }) => {
  return (
    <>
      <div className="relative bg-black/40 h-[25vh]  m-4 p-2 grid grid-rows-2 rounded-2xl shadow-md cursor-pointer hover:bg-black/50 hover:border hover:border-white transition-colors duration-100">
        <div className="p-2 w-full flex justify-center items-center">
          <img src={tab?.favicon} className="w-[50px]" />
        </div>

        <p className="p-2 text-white font-semibold text-lg text-center">
          {tab?.title.length > 13
            ? tab?.title.substring(0, 13) + "..."
            : tab?.title}
        </p>

        <p className="p-2 text-white font-semibold text-lg text-center">
          {Math.floor(tab.activetime / 60) + "minutes"}
        </p>
      </div>
    </>
  );
};

export default BarGraph;
