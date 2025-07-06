import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGameStore,
  useCharacterStore,
  ActiveMessageConversation,
  MessageHistoryItem,
} from "../../store";
import { getUpcomingEvents } from "../../data/calendarEvents";
import { getCharacterById, CHARACTERS_DATA } from "../../data/characters";
import { COMBINED_STORY_DATA } from "../../data/story/senpai_A_sidequest_1";
import { StoryEngine } from "../../engines/StoryEngine";
import { MESSAGE_TRIGGERS } from "../../data/messageTriggers";
import { TypingIndicator } from "../../components/TypingIndicator";
import { StoryNode, Choice } from "../../types";

const phoneVariants = {
  hidden: { x: "-100%", opacity: 0.5 },
  visible: { x: 0, opacity: 1, transition: { type: "tween", ease: "easeOut", duration: 0.4 } },
  exit: { x: "-100%", opacity: 0.5, transition: { type: "tween", ease: "easeIn", duration: 0.3 } },
};

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM15 12h.008v.008H15v-.008ZM15 15h.008v.008H15v-.008ZM9 15h.008v.008H9v-.008ZM9.75 12h-.008v.008h.008V12ZM7.5 15h.008v.008H7.5v-.008ZM7.5 12h.008v.008H7.5V12Zm2.25-3h3.5m-3.5 0h3.5" /></svg>
);
const ContactsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
);
const MessagesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.04 8.25-7.5 8.25S6 16.556 6 12s3.04-8.25 7.5-8.25S21 7.444 21 12Z" /></svg>
);

const ConversationHeader: React.FC<{ characterId: string; onClose?: () => void }> = ({ characterId, onClose }) => {
  const character = getCharacterById(characterId);
  return (
    <div className="flex items-center p-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">
      {onClose && <button onClick={onClose} className="text-purple-300 font-semibold mr-2 text-lg">←</button>}
      <img src={character?.sprites.default} alt={character?.name} className="w-8 h-8 rounded-full mr-2" />
      <span className="font-bold">{character?.name}</span>
    </div>
  );
};

const MessageBubble: React.FC<{ message: MessageHistoryItem; characterSprite?: string }> = ({ message, characterSprite }) => {
  const isPlayer = message.sender === 'player';
  return (
    <div className={`flex items-end gap-2 ${isPlayer ? "justify-end" : "justify-start"}`}>
      {!isPlayer && <img src={characterSprite} alt="" className="w-6 h-6 rounded-full" />}
      <p className={`max-w-[70%] p-2 px-3 rounded-lg ${isPlayer ? "bg-blue-600 text-white" : "bg-slate-600 text-white"}`}>
        {message.text}
      </p>
    </div>
  );
};

interface MessageConversationViewProps {
  conversation: ActiveMessageConversation;
  onClose: () => void;
}
const MessageConversationView: React.FC<MessageConversationViewProps> = ({ conversation, onClose }) => {
  const { characterId, currentMessageNodeId, triggerId } = conversation;
  const advanceMessageNode = useGameStore((state) => state.advanceMessageNode);
  const saveConversationHistory = useGameStore((state) => state.saveConversationHistory);
  const storyEngine = useMemo(() => new StoryEngine(COMBINED_STORY_DATA), []);
  
  const [history, setHistory] = useState<MessageHistoryItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<Choice[]>([]);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const node = storyEngine.getNode(currentMessageNodeId);


        if (!node) {
      setIsTyping(false);
      setCurrentChoices([]);
      return;
    }

    const processNode = (currentNode: StoryNode) => {
      setHistory(prevHistory => {
        let updatedHistory = prevHistory;
        if (currentNode.text) {
          const newText = Array.isArray(currentNode.text) ? currentNode.text.join("\n") : currentNode.text;
          updatedHistory = [...prevHistory, { sender: currentNode.characterId ?? "player", text: newText }];
        }
        const isTerminalNode = !currentNode.choices?.length && !currentNode.nextNodeId;
        if (isTerminalNode) {
          saveConversationHistory(triggerId, updatedHistory);
        }
        return updatedHistory;
      });

      if (currentNode.effects) {
        storyEngine.applyEffects(currentNode.effects, useGameStore.getState(), useCharacterStore.getState());
      }

      if (currentNode.choices) {
        setCurrentChoices(currentNode.choices);
      } else {
        const nextNodeId = currentNode.nextNodeId;
        if (nextNodeId) {
          setTimeout(() => advanceMessageNode(nextNodeId), 20);
        }
      }
    };



    if (node.characterId !== "player" && node.text) {
      setIsTyping(true);
      setCurrentChoices([]);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        processNode(node);
      }, node.typingDelay ?? 1200);
    } else {
      processNode(node);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentMessageNodeId, storyEngine, advanceMessageNode, saveConversationHistory, triggerId]);

  const handleReply = (choice: Choice) => {
    setHistory((h) => [...h, { sender: "player", text: choice.text }]);
    if (choice.effects) {
      storyEngine.applyEffects(choice.effects, useGameStore.getState(), useCharacterStore.getState());
    }
    advanceMessageNode(choice.nextStoryNodeId);
    setCurrentChoices([]);
  };

  const senderCharacter = getCharacterById(characterId);

  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col h-full z-50">
      <ConversationHeader characterId={characterId} onClose={onClose} />
      <div className="flex-grow p-3 space-y-3 overflow-y-auto">
        {history.map((msg, index) => (
          <MessageBubble key={index} message={msg} characterSprite={senderCharacter?.sprites.default} />
        ))}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <img src={senderCharacter?.sprites.default} alt="" className="w-6 h-6 rounded-full" />
            <div className="py-3 px-4 bg-slate-600 rounded-lg"><TypingIndicator /></div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-slate-700 flex-shrink-0">
        {currentChoices.map((choice, i) => (
          <button key={i} onClick={() => handleReply(choice)} className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded-md mb-1">
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

interface MessageHistoryViewProps {
  history: MessageHistoryItem[];
  characterId: string;
  onClose: () => void;
}
const MessageHistoryView: React.FC<MessageHistoryViewProps> = ({ history, characterId, onClose }) => {
  const character = getCharacterById(characterId);
  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col h-full z-50">
      <ConversationHeader characterId={characterId} onClose={onClose} />
      <div className="flex-grow p-3 space-y-3 overflow-y-auto">
        {history.map((msg, index) => (
          <MessageBubble key={index} message={msg} characterSprite={character?.sprites.default} />
        ))}
      </div>
    </div>
  );
};

export const PhoneScreen: React.FC = () => {
  const closePhone = useGameStore((state) => state.closePhone);
  const openMessageConversation = useGameStore((state) => state.openMessageConversation);
  const activeMessageConversation = useGameStore((state) => state.activeMessageConversation);
  const conversationHistories = useGameStore((state) => state.conversationHistories);
  const currentDay = useGameStore((state) => state.currentDay);
  const unreadMessages = useGameStore((state) => state.unreadMessages);
  const readMessages = useGameStore((state) => state.readMessages);

  const characterStates = useCharacterStore((state) => state.characters);
  
  const [viewMode, setViewMode] = useState<"schedule" | "contacts" | "messages">("messages");
  const [historyToView, setHistoryToView] = useState<MessageHistoryItem[] | null>(null);
  const [historyCharId, setHistoryCharId] = useState<string>('');

  const closePhoneAndViews = useCallback(() => {
    setHistoryToView(null);
    closePhone();
  }, [closePhone]);

  const handleMessageClick = (triggerId: string) => {
    const completedHistory = conversationHistories[triggerId];
    if (completedHistory) {
      const trigger = MESSAGE_TRIGGERS.find(t => t.id === triggerId)!;
      setHistoryCharId(trigger.characterId);
      setHistoryToView(completedHistory);
    } else {
      openMessageConversation(triggerId);
    }
  };

  const allMessageTriggerIds = useMemo(() => {
    const ids = Array.from(new Set([...unreadMessages, ...readMessages]));
    ids.sort((a, b) => {
      const triggerA = MESSAGE_TRIGGERS.find((t) => t.id === a);
      const triggerB = MESSAGE_TRIGGERS.find((t) => t.id === b);
      return (triggerA?.day ?? 0) - (triggerB?.day ?? 0) || MESSAGE_TRIGGERS.indexOf(triggerA!) - MESSAGE_TRIGGERS.indexOf(triggerB!);
    });
    return ids;
  }, [unreadMessages, readMessages]);

  const metCharacterIds = useMemo(() => {
    const ids = Object.keys(characterStates).filter((id) => characterStates[id]?.hasMet && id !== "player");
    ids.sort((a, b) => (CHARACTERS_DATA[a]?.name ?? "").localeCompare(CHARACTERS_DATA[b]?.name ?? ""));
    return ids;
  }, [characterStates]);
  
  const upcomingEvents = useMemo(() => getUpcomingEvents(currentDay, 7), [currentDay]);

  if (activeMessageConversation) {
    return <MessageConversationView conversation={activeMessageConversation} onClose={closePhoneAndViews} />;
  }

  if (historyToView) {
    return <MessageHistoryView history={historyToView} characterId={historyCharId} onClose={() => setHistoryToView(null)} />;
  }

  return (
    <AnimatePresence>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={closePhoneAndViews}>
        <motion.div
          className="relative w-full max-w-sm h-[70vh] max-h-[600px] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-700 flex flex-col"
          variants={phoneVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-8 bg-black flex items-center justify-center text-xs text-gray-400 relative flex-shrink-0">
            <div className="w-20 h-5 bg-gray-800 rounded-full"></div>
          </div>

          <div className="flex-grow overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 text-gray-200 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {viewMode === "schedule" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-purple-300 flex items-center"><CalendarIcon className="w-5 h-5 mr-2" />日程表</h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">今天是</p>
                    <p className="text-lg font-semibold">第 {currentDay} 天</p>
                  </div>
                </div>
                {upcomingEvents.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <li key={event.id} className={`p-3 rounded-lg shadow ${event.day === currentDay ? "bg-purple-900 bg-opacity-50 border border-purple-700" : "bg-slate-700 bg-opacity-50"}`}>
                        <p className="font-semibold text-white">{event.icon && <span className="mr-1.5">{event.icon}</span>}第 {event.day} 天 {event.timeOfDay && `(${event.timeOfDay})`} - {event.title}</p>
                        {event.description && <p className="text-sm text-gray-300 mt-1">{event.description}</p>}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-center text-gray-400 mt-8">最近沒有特殊行程。</p>}
              </div>
            )}
            {viewMode === "contacts" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-purple-300 flex items-center"><ContactsIcon className="w-5 h-5 mr-2" />聯絡人</h2>
                </div>
                {metCharacterIds.length > 0 ? (
                  <ul className="space-y-3">
                    {metCharacterIds.map((charId) => {
                      const characterData = getCharacterById(charId)!;
                      const characterState = characterStates[charId]!;
                      const affectionPercentage = Math.max(0, Math.min(100, characterState.affection));
                      const filledHearts = Math.round((affectionPercentage / 100) * 5);
                      return (
                        <li key={charId} className="flex items-center p-3 bg-slate-700 bg-opacity-60 rounded-lg shadow">
                          <div className="flex-shrink-0 w-14 h-14 mr-3 bg-gray-600 rounded-full overflow-hidden border-2 border-slate-500 flex items-center justify-center">
                            <img src={characterData.sprites.default} alt={characterData.name} className="w-full h-full object-contain p-0.5" style={{ imageRendering: "pixelated" }} />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-lg text-white">{characterData.name}</p>
                            <div className="flex items-center space-x-0.5 mt-1" title={`好感度: ${characterState.affection}`}>
                              {[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < filledHearts ? "text-pink-500" : "text-gray-600"}`}>♥︎</span>)}
                              <span className="text-xs text-gray-400 ml-1.5">({characterState.affection})</span>
                            </div>
                            {characterData.description && <p className="text-xs text-gray-400 mt-1 truncate">{characterData.description}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="text-center text-gray-400 mt-8">尚未交換任何人的聯絡方式。</p>}
              </div>
            )}
            {viewMode === "messages" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-purple-300 flex items-center"><MessagesIcon className="w-5 h-5 mr-2"/>訊息</h2>
                </div>
                {allMessageTriggerIds.length > 0 ? (
                  <ul className="space-y-2">
                    {allMessageTriggerIds.map((triggerId) => {
                      const trigger = MESSAGE_TRIGGERS.find((t) => t.id === triggerId)!;
                      const char = getCharacterById(trigger.characterId);
                      const isUnread = unreadMessages.includes(triggerId);
                      return (
                        <li key={triggerId} onClick={() => handleMessageClick(triggerId)} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer flex items-center transition-colors duration-150">
                          <div className="relative flex-shrink-0">
                            <img src={char?.sprites.default} alt={char?.name} className="w-10 h-10 rounded-full mr-3"/>
                            {isUnread && <span className="absolute top-0 left-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-slate-700"></span>}
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <p className="font-bold truncate">{char?.name}</p>
                            <p className={`text-sm truncate ${isUnread ? "text-white" : "text-gray-400"}`}>{trigger.title}</p>
                          </div>
                          <span className="ml-auto text-gray-500 flex-shrink-0">&gt;</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="text-center text-gray-400 mt-8">沒有任何訊息。</p>}
              </div>
            )}
          </div>
          <div className="flex justify-around items-center h-16 bg-black bg-opacity-80 border-t border-gray-700 flex-shrink-0">
            <button onClick={() => setViewMode("schedule")} className={`p-2 rounded-lg ${viewMode === "schedule" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`} title="日程"><CalendarIcon className="w-7 h-7" /></button>
            <button onClick={() => setViewMode("contacts")} className={`p-2 rounded-lg ${viewMode === "contacts" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`} title="聯絡人"><ContactsIcon className="w-7 h-7" /></button>
            <button onClick={() => setViewMode("messages")} className={`p-2 rounded-lg ${viewMode === "messages" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`} title="訊息"><MessagesIcon className="w-7 h-7" /></button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};