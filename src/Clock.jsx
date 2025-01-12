import React, { useState, useRef } from "react";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { MdNotStarted, MdRestartAlt } from "react-icons/md";
import { FaPause } from "react-icons/fa";

export default function Clock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [sessionMinutes, setSessionMinutes] = useState(sessionLength);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [isAlert, setIsAlert] = useState(false);

  const intervalRef = useRef(null);
  const sessionMinutesRef = useRef(sessionLength);
  const sessionSecondsRef = useRef(0);

  const beepRef = useRef(null);

  const updateSessionTime = () => {
    setSessionMinutes(sessionMinutesRef.current);
    setSessionSeconds(sessionSecondsRef.current);
  };

  const handleIncrementAndDecrement = (type) => {
    if (type === "incrementBreak" && breakLength < 60) {
      setBreakLength(breakLength + 1);
    } else if (type === "decrementBreak" && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }

    if (type === "incrementSession" && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      sessionMinutesRef.current = sessionLength + 1;
      sessionSecondsRef.current = 0;
      updateSessionTime();
    } else if (type === "decrementSession" && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      sessionMinutesRef.current = sessionLength - 1;
      sessionSecondsRef.current = 0;
      updateSessionTime();
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      if (sessionSecondsRef.current === 0) {
        if (sessionMinutesRef.current === 0) {
          beepRef.current.play();
          setIsAlert(true); // Trigger alert mode
          clearInterval(intervalRef.current); // Stop the timer
        } else {
          sessionMinutesRef.current -= 1;
          sessionSecondsRef.current = 59;
        }
      } else {
        sessionSecondsRef.current -= 1;
      }
      updateSessionTime();
    }, 1000);
  };

  const handleStartStop = () => {
    if (isAlert) {
      // If in alert mode, transition to the next phase
      setIsAlert(false);
      setIsSession(!isSession);
      sessionMinutesRef.current = isSession ? breakLength : sessionLength;
      sessionSecondsRef.current = 0;
      updateSessionTime();
      setIsRunning(true);
      startTimer();
      return;
    }

    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      startTimer();
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsSession(true);
    setIsAlert(false);
    setBreakLength(5);
    setSessionLength(25);
    sessionMinutesRef.current = 25;
    sessionSecondsRef.current = 0;
    updateSessionTime();
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const formatTime = (minutes, seconds) => {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <h1 className="text-center">25 + 5 Clock</h1>
      <div className="row justify-content-center">
        <div id="break-label" className="col-6">
          <h2>Break Length</h2>
          <div className="row align-items-center justify-content-center fs-2">
            <div
              id="break-increment"
              className="col-auto"
              onClick={() => handleIncrementAndDecrement("incrementBreak")}
            >
              <GoArrowUp />
            </div>
            <div className="col-auto fs-2">{breakLength}</div>
            <div
              id="break-decrement"
              className="col-auto"
              onClick={() => handleIncrementAndDecrement("decrementBreak")}
            >
              <GoArrowDown />
            </div>
          </div>
        </div>

        <div id="session-label" className="col">
          <h2>Session Length</h2>
          <div className="row align-items-center justify-content-center fs-2">
            <div
              id="session-increment"
              className="col-auto"
              onClick={() => handleIncrementAndDecrement("incrementSession")}
            >
              <GoArrowUp />
            </div>
            <div className="col-auto ">{sessionLength}</div>
            <div
              id="session-decrement"
              className="col-auto"
              onClick={() => handleIncrementAndDecrement("decrementSession")}
            >
              <GoArrowDown />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`border w-md-25 w-75 rounded-pill my-5 mx-auto p-5  ${
          isAlert ? "text-danger border-danger" : ""
        }`}
      >
        <h1 id="timer-label" >{isSession ? "Session" : "Break"}</h1>
        <div id="time-left" className="fs-1">{formatTime(sessionMinutes, sessionSeconds)}</div>
      </div>
      <div className="row justify-content-center align-items-center fs-2">
        <div id="start_stop" className="col-auto" onClick={handleStartStop}>
         <MdNotStarted  />
        </div>
        <div id="pause" className="col-auto" onClick={handleStartStop}>
          <FaPause />
        </div>
        <div id="reset" className="col-auto" onClick={handleReset}>
          <MdRestartAlt />
        </div>
      </div>
      <audio
        id="beep"
        ref={beepRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      />
    </>
  );
}
