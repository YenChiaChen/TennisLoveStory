// src/features/PhoneScreen/PhoneScreen.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore, useCharacterStore } from "../../store";
import {
  CALENDAR_EVENTS_DATA,
  getUpcomingEvents,
} from "../../data/calendarEvents"; // Import event data and helper
import { CHARACTERS_DATA, getCharacterById } from "../../data/characters"; // Import character data

const phoneVariants = {
  hidden: { x: "-100%", opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", ease: "easeOut", duration: 0.4 },
  },
  exit: {
    x: "-100%",
    opacity: 0.5,
    transition: { type: "tween", ease: "easeIn", duration: 0.3 },
  },
};

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM15 12h.008v.008H15v-.008ZM15 15h.008v.008H15v-.008ZM9 15h.008v.008H9v-.008ZM9.75 12h-.008v.008h.008V12ZM7.5 15h.008v.008H7.5v-.008ZM7.5 12h.008v.008H7.5V12Zm2.25-3h3.5m-3.5 0h3.5"
    />
  </svg>
);

export const PhoneScreen: React.FC = () => {
  const closePhone = useGameStore((state) => state.closePhone);
  const currentDay = useGameStore((state) => state.currentDay);
  const [viewMode, setViewMode] = useState<
    "schedule" | "contacts" | "messages"
  >("schedule"); // State for different phone apps

  const upcomingEvents = getUpcomingEvents(currentDay, 7);

  const characterStates = useCharacterStore((state) => state.characters);
  const metCharacterIds = Object.keys(characterStates)
    .filter((id) => characterStates[id]?.hasMet && id !== "player")
    .sort((a, b) => {
      // Sort by name for consistency
      const nameA = CHARACTERS_DATA[a]?.name ?? "";
      const nameB = CHARACTERS_DATA[b]?.name ?? "";
      return nameA.localeCompare(nameB);
    });
  // --- End Character Data ---

  return (
    // Fullscreen overlay to catch clicks outside the phone
    <div
      className="absolute inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={closePhone}
    >
      {/* Phone Body */}
      <motion.div
        className="relative w-full max-w-sm h-[70vh] max-h-[600px] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-700 flex flex-col"
        variants={phoneVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside phone
      >
        {/* Notch/Top Bar Area (Optional cosmetic) */}
        <div className="h-8 bg-black flex items-center justify-center text-xs text-gray-400 relative">
          <span className="absolute left-3">{/* Time? */}</span>
          <div className="w-20 h-5 bg-gray-800 rounded-full"></div>{" "}
          {/* Notch */}
          <span className="absolute right-3">{/* Signal/Wifi? */}</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 p-4 text-gray-200 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {/* App Content */}
          {viewMode === "schedule" && (
            <>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
                <h2 className="text-xl font-bold text-purple-300 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  日程表
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-400">今天是</p>
                  <p className="text-lg font-semibold">第 {currentDay} 天</p>
                </div>
              </div>

              {upcomingEvents.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      className={`p-3 rounded-lg shadow ${
                        event.day === currentDay
                          ? "bg-purple-900 bg-opacity-50 border border-purple-700"
                          : "bg-slate-700 bg-opacity-50"
                      }`}
                    >
                      <p className="font-semibold text-white">
                        {event.icon && (
                          <span className="mr-1.5">{event.icon}</span>
                        )}
                        第 {event.day} 天{" "}
                        {event.timeOfDay && `(${event.timeOfDay})`} -{" "}
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-300 mt-1">
                          {event.description}
                        </p>
                      )}
                      {/* Maybe add location/character info here */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 mt-8">
                  最近沒有特殊行程。
                </p>
              )}
            </>
          )}
          {/* Add sections for 'contacts' or 'messages' later */}
          {viewMode === "contacts" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
                <h2 className="text-xl font-bold text-purple-300 flex items-center">
                  {/* Contacts Icon */}
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  聯絡人
                </h2>
              </div>

              {metCharacterIds.length === 0 ? (
                <p className="text-center text-gray-400 mt-8">
                  尚未交換任何人的聯絡方式。
                </p>
              ) : (
                <ul className="space-y-3">
                  {metCharacterIds.map((charId) => {
                    const characterData = getCharacterById(charId);
                    const characterState = characterStates[charId];
                    if (!characterData || !characterState) return null;

                    // Simple Heart Bar visual
                    const affectionPercentage = Math.max(
                      0,
                      Math.min(100, characterState.affection)
                    );
                    const heartSegments = 5; // e.g., 5 hearts total
                    const filledHearts = Math.round(
                      (affectionPercentage / 100) * heartSegments
                    );

                    return (
                      <li
                        key={charId}
                        className="flex items-center p-3 bg-slate-700 bg-opacity-60 rounded-lg shadow"
                      >
                        {/* Portrait */}
                        <div className="flex-shrink-0 w-14 h-14 mr-3 bg-gray-600 rounded-full overflow-hidden border-2 border-slate-500 flex items-center justify-center">
                          {characterData.sprites.default ? (
                            <img
                              src={characterData.sprites.default}
                              alt={characterData.name}
                              className="w-full h-full object-contain p-0.5"
                              style={{ imageRendering: "pixelated" }}
                            />
                          ) : (
                            <span className="text-gray-400 text-xl">?</span>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-grow">
                          <p className="font-semibold text-lg text-white">
                            {characterData.name}
                          </p>
                          {/* Affection Bar */}
                          <div
                            className="flex items-center space-x-0.5 mt-1"
                            title={`好感度: ${characterState.affection}`}
                          >
                            {[...Array(heartSegments)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < filledHearts
                                    ? "text-pink-500"
                                    : "text-gray-600"
                                }`}
                              >
                                ♥︎ {/* Or use a filled/empty heart icon */}
                              </span>
                            ))}
                            <span className="text-xs text-gray-400 ml-1.5">
                              ({characterState.affection})
                            </span>
                          </div>
                          {/* Optional: Description or status */}
                          {characterData.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {characterData.description}
                            </p>
                          )}
                        </div>
                        {/* Optional: Action Button (e.g., call, view details) */}
                        {/* <button className='ml-2 p-1 text-gray-400 hover:text-white'>...</button> */}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          {viewMode === "messages" && (
            <p className="text-center text-gray-400 mt-8">訊息功能尚未開放。</p>
          )}
        </div>

        {/* Bottom Navigation Bar (App Icons) */}
        <div className="flex justify-around items-center h-16 bg-black bg-opacity-80 border-t border-gray-700">
          <button
            onClick={() => setViewMode("schedule")}
            className={`p-2 rounded-lg ${
              viewMode === "schedule"
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title="日程"
          >
            <CalendarIcon className="w-7 h-7" />
          </button>
          <button
            onClick={() => setViewMode("contacts")}
            className={`p-2 rounded-lg ${
              viewMode === "contacts"
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title="聯絡人"
          >
            {/* Placeholder Icon */}
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("messages")}
            className={`p-2 rounded-lg ${
              viewMode === "messages"
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title="訊息"
          >
            {/* Placeholder Icon */}
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.04 8.25-7.5 8.25S6 16.556 6 12s3.04-8.25 7.5-8.25S21 7.444 21 12Z"
              />
            </svg>
          </button>
          {/* Close Button maybe integrated here? Or keep the overlay click */}
        </div>
      </motion.div>
    </div>
  );
};
