// src/components/CountdownTimer.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  endTime: string;
  size?: "sm" | "md" | "lg" | "xl";
  shortLabels?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  size = "md",
  shortLabels = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  const getLabel = (interval: string) => {
    if (!shortLabels) return interval;
    switch (interval) {
      case "days":
        return "D";
      case "hours":
        return "H";
      case "minutes":
        return "M";
      case "seconds":
        return "S";
      default:
        return interval;
    }
  };

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => (
    <motion.div
      key={interval}
      className={`flex flex-col items-center ${getFontSize()} ${
        shortLabels ? "mx-1" : "mx-2"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-gray-600 dark:text-gray-400">
        {getLabel(interval)}
      </span>
      <span className="font-bold ">{value}</span>
    </motion.div>
  ));

  return (
    <div className="flex">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className={getFontSize()}>Time's up!</span>
      )}
    </div>
  );
};

export default CountdownTimer;
