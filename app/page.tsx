"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [inputMinutes, setInputMinutes] = useState("0");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect ( () => {
    let timer: NodeJS.Timeout

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev -1;
        })
      }, 1000);
    }

    return () => clearInterval(timer)

  }, [isRunning]);

  // Spacebar control
  useEffect (() => {
    const handlekey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsRunning((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handlekey);
    return () => window.removeEventListener("keydown", handlekey);
  }, []);

  // Local Storage
  useEffect (() => {
    const saved = localStorage.getItem("church-timer");
    if (saved) {
      setTime(Number(saved));
    }
  }, []);

  useEffect (() => {
    localStorage.setItem("church-timer", String(time));
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="h-screen w-full overflow-hidden bg-black text-white flex flex-col items-center justify-center">
      {!presentationMode && (
        <>
          {/* Church Timer Title */}
            <h1 className="text-5xl md:text-6xl mb-6 font-semibold tracking-wide">
              Church Timer
            </h1>
        </>
      )}

      {/* Time Display */}
      <h2 className={`text-8xl md:text-9xl font-bold ${time === 0 ? "animate-pulse text-red-600" : "text-white"}`}>
      {time === 0 && hasStarted ? "TIME OUT" :`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
        {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} */}
      </h2>

      {/* Back Button */}
      {presentationMode && (
        <>
          <button onClick={() => setPresentationMode(false)} className="absolute top-5 right-5 opacity-20 px-4 py-2 bg-white/20 text-white rounded-md text-sm hover:opacity-100 transition cursor-pointer">
            Exit
          </button>
        </>
      )}

      {!presentationMode && (
        <>
          {/* Input Button */}
      <div className="flex items-center gap-3 mb-6 mt-3">
        <input type="number" placeholder="0" value={inputMinutes} onFocus={() => setInputMinutes("")} onChange={(e) => {const value = e.target.value; const cleaned = value.replace(/^0+/, ""); setInputMinutes(cleaned);}} className="px-4 py-2 bg-white text-black rounded-md w-24 outline-none" />

        <button onClick={() => {
          setTime(Number(inputMinutes) * 60);
          setIsRunning(false)
        }} className="px-4 py-2 bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 transition">
          Set Time
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 px-1">
        <button 
          onClick={() => {setIsRunning(true); setHasStarted(true);}} 
          className="px-6 py-3 bg-green-600 rounded-xl text-xl cursor-pointer hover:bg-green-700 transition">
            start
        </button>

        <button 
          onClick={() => setIsRunning(false)} 
          className="px-6 py-3 bg-yellow-500 rounded-xl text-xl cursor-pointer hover:bg-yellow-600 transition">
            Pause
        </button>

        <button 
          onClick={() => {setIsRunning(false); setTime(0); setHasStarted(false)}} 
          className="px-6 py-3 bg-red-600 rounded-xl text-xl cursor-pointer hover:bg-red-700 transition">
            Reset
        </button>

        {/* Full Screen Button */}
        <button 
        onClick={() => document.documentElement.requestFullscreen()}
        className="px-6 py-3 bg-blue-600 rounded-xl text-xl cursor-pointer hover:bg-blue-700 transition">
          Full Screen
        </button>
      </div>

      {/* Toggle Presentation Button */}
      <button onClick={() => setPresentationMode((prev) => !prev)} className="px-6 py-3 bg-purple-600 rounded-xl text-xl mt-6 cursor-pointer hover:bg-purple-700 transition">
        Toggle Presentation
      </button>
        </>
      )}
    </div>
  )
}