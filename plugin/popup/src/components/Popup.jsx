/*global chrome*/
import React, { useEffect, useState } from "react";

const Popup = () => {
  const changeOptions = (e, type) => {
    if (type === 0) {
      setc1(e.target.checked);
      chrome.storage.local.set({ extension: e.target.checked }, function () {});
    } else if (type === 1) {
      setc2(e.target.checked);
      chrome.storage.local.set(
        { shortParah: e.target.checked },
        function () {}
      );
    } else if (type === 2) {
      setc3(e.target.checked);
      chrome.storage.local.set({ screen: e.target.checked }, function () {});
    }
  };

  const [c1, setc1] = useState(false);
  const [c2, setc2] = useState(false);
  const [c3, setc3] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["extension"], function (result) {
      if (result.extension) {
        setc1(result.extension);
      }
    });
    chrome.storage.local.get(["shortParah"], function (result) {
      if (result.shortParah) {
        setc2(result.shortParah);
      }
    });
    chrome.storage.local.get(["screen"], function (result) {
      if (result.screen) {
        setc3(true);
      }
    });
  }, []);
  return (
    <div className="h-[400px] w-[300px] bg-[#FFFDD0]">
      <div className="flex flex-col ">
        <div className="flex justify-center py-4">
          <p className="text-2xl font-bold">LexiScan</p>
        </div>
        <div className="flex justify-center py-4">
          <img
            src="https://raw.githubusercontent.com/samjain233/renaissance/main/logo.png"
            width="80px"
            height="80px"
          />
        </div>
        {/* radio buttons  */}
        <div className="px-8 ">
          <div className="grid grid-cols-2 mb-4">
            <p className="mr-2 text-base font-bold">Extension On/Off</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={c1}
                onChange={(e) => changeOptions(e, 0)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="grid grid-cols-2 mb-4">
            <p className="mr-2 text-base font-bold">Shorter Paragraph</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={c2}
                onChange={(e) => changeOptions(e, 1)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="grid grid-cols-2 mb-4">
            <p className="mr-2 text-base font-bold">Screen Break</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={c3}
                onChange={(e) => changeOptions(e, 2)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
