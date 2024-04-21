/*global chrome*/
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.gemini);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Panel = () => {
  const [pause, setPause] = useState(false);
  const [width, setWidth] = useState(0);
  const [isExtensionOn, setExtensionOn] = useState(false);
  const [shortParah, setShortParah] = useState(false);
  const [screenBreak, setScreenBreak] = useState(false);

  const audioApi = async (text) => {
    const url = "https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.audio_api,
        "X-RapidAPI-Host": "cloudlabs-text-to-speech.p.rapidapi.com",
      },
      body: new URLSearchParams({
        voice_code: "en-US-1",
        text: text,
        speed: "0.75",
        pitch: "1.00",
        output_type: "audio_url",
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      return result.result.audio_url;
    } catch (error) {
      console.error(error);
    }
  };

  const audioButtonHandler = async (text, img) => {
    // img.src = loader;
    const audioUrl = await audioApi(text);
    const audio = new Audio(audioUrl);
    img.src = "https://img.icons8.com/flat-round/64/high-volume--v1.png";
    audio.play();
  };

  const getParah = async (parah) => {
    let prompt =
      "Return the given paragraph after paraphrasing it to make it simpler for a dyslexic person to read and understand:\n" +
      parah.innerText +
      " \nDo not include any explanation";
    if (shortParah) {
      prompt =
        "Return the given paragraph after paraphrasing it to make it simpler for a dyslexic person to read and understand:\n" +
        parah.innerText +
        "\nthe length should be not be more than the half of original paragraph and Do not include any explanation and heading";
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    div.style.cssText = parah.style.cssText;
    div.style.fontFamily = "monospace";
    div.style.fontSize = "16px";
    div.style.backgroundColor = "#faf9f6"; //off white fffdd0
    div.style.padding = "20px";
    div.style.marginTop = "10px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "20px";
    div.style.display = "flex";
    div.style.flexDirection = "column";

    // div.style.filter = "brightness(50%)";
    div.style.lineHeight = "2.5em";
    // div.style.filter = 'brightness(100%)';
    parah.parentNode.replaceChild(div, parah);

    //image section -------------------
    const randomNumber = Math.floor(Math.random() * 10);
    if (text.length > 100 && randomNumber <= 3) {
      //*TODO* change to 2 or 3
      const form = new FormData();
      form.append("prompt", text);
      const parahImage = document.createElement("img");
      const url = "https://clipdrop-api.co/text-to-image/v1";
      const options = {
        method: "POST",
        headers: {
          "x-api-key":
            process.env.clipboard,
        },
        body: form,
      };

      fetch(url, options)
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const blob = new Blob([buffer], { type: "image/png" });
          parahImage.src = URL.createObjectURL(blob);
        });

      if (div.lastElementChild) {
        div.lastElementChild.appendChild(parahImage);
      } else {
        div.appendChild(parahImage);
      }
    }
    //---------------------------------

    //audio button -----------------
    const button = document.createElement("button");
    const img = document.createElement("img");
    img.src = "https://img.icons8.com/flat-round/64/high-volume--v1.png";
    img.alt = "Play audio";
    button.appendChild(img);
    button.style.float = "right";
    button.addEventListener("click", () => {
      audioButtonHandler(text, img);
    });

    if (div.lastElementChild) {
      div.lastElementChild.appendChild(button);
    } else {
      div.appendChild(button);
    }
    //-------------------------------
  };

  useEffect(() => {
    chrome.storage.local.get(["extension"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving data:", chrome.runtime.lastError);
      } else {
        console.log(result.extension);
        setExtensionOn(result.extension);
        if (result.extension) {
          const paragraphs = document.querySelectorAll("p");

          const longParagraphs = Object.values(paragraphs).filter(
            (paragraph) => paragraph.innerText.length >= 80
          );

          longParagraphs.forEach((para) => {
            getParah(para);
          });

          document.addEventListener("mouseup", getSelection);
        }
      }
    });

    chrome.storage.local.get(["shortParah"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving data:", chrome.runtime.lastError);
      } else {
        console.log(result.shortParah);
        setShortParah(result.shortParah);
      }
    });

    chrome.storage.local.get(["screen"], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving data:", chrome.runtime.lastError);
      } else {
        console.log(result.screen);
        setScreenBreak(result.screen);
      }
    });

    const getSelection = async () => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);
        const prompt =
          "Tell the simplified meaning of the given piece of text after repeating the text, and do not include any other explanation:\n" +
          selectedText;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        const audioUrl = await audioApi(text);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    };

    return () => {
      window.removeEventListener("mouseup", getSelection);
    };
  }, []);

  const incrementWidth = () => {
    setWidth((prevWidth) => {
      return prevWidth + 1.66;
    });
  };

  //1 min break;
  const displayPause = () => {
    setPause(true);
    setWidth(0);
    setTimeout(() => {
      hidePause();
      clearInterval(intervalId);
    }, 60000);
    const intervalId = setInterval(() => {
      incrementWidth();
    }, 1000);
  };

  //5 min display
  const hidePause = () => {
    setPause(false);
    setTimeout(() => {
      displayPause();
    }, 300000);
  };

  useEffect(() => {
    if (isExtensionOn && screenBreak) hidePause();
  }, [isExtensionOn, screenBreak]);

  return (
    <>
      {pause && (
        <div className="z-[999999] fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
          <div className="h-[100%] w-[100%] backdrop-blur-md bg-white/20 rounded-2xl shadow-md flex flex-col items-center justify-center p-[10%]">
            <p className="text-black text-[72px] font-bold font-mono ">
              Time for a quick pause! Recharge and return refreshed.
            </p>
            <div className="border-2 border-black w-[50%] h-[40px] mt-[100px]">
              <div
                className=" bg-black h-full"
                style={{ width: width + "%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Panel;
