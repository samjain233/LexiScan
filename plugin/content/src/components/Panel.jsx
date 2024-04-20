/*global chrome*/
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDNCxOUOlrfz3XmK85_0WPtGxU_O7XE1wA");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Panel = () => {
  const port = chrome.runtime.connect({ name: "tabify" });

  const getParah = async (parah) => {
    const prompt =
      "simplify the given paragraph and highlight important points by making them bold then return html for that: " +
      parah.innerText;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    parah.innerHTML = text;
  };

  useEffect(() => {
    const paragraphs = document.querySelectorAll("p");
    const longParagraphs = Object.values(paragraphs).filter(
      (paragraph) => paragraph.innerText.length >= 80
    );
    longParagraphs.forEach((para) => {
      console.log(para.innerText);
    });
    getParah(longParagraphs[0]);
    getParah(longParagraphs[1]);
  }, []);

  useEffect(() => {
    port.onMessage.addListener(function (response) {
      console.log(response);
    });
  }, [port]);

  return <></>;
};

export default Panel;
// AIzaSyDNCxOUOlrfz3XmK85_0WPtGxU_O7XE1wA
