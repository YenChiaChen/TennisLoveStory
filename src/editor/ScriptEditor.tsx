import React, { useState, useEffect } from "react";
import {create} from "zustand";

// --- Types ---
export type Choice = {
  text: string;
  nextStoryNodeId: string;
};

export interface StoryNode {
  id: string;                         // Unique node ID
  nodeType?: "dialogue" | "eventTitle";
  sceneId: string;                   // Background scene ID
  characterId?: string;              // Speaking character ID
  spriteExpression?: string;         // Character expression key
  text: string | string[];           // Dialogue text
  choices?: Choice[];                // Player choices
  eventTitleText?: string;           // For eventTitle nodes
  nextNodeId?: string;               // Auto-advance
}

export type StoryData = Record<string, StoryNode>;

// --- Zustand Store ---
interface ScriptStore {
  nodes: StoryData;
  addNode: (node: StoryNode) => void;
  reset: () => void;
}

const useScriptStore = create<ScriptStore>((set, get) => ({
  nodes: {},
  addNode: (node) => set(state => ({ nodes: { ...state.nodes, [node.id]: node } })),
  reset: () => set({ nodes: {} }),
}));

// --- Script Editor Component ---
const ScriptEditor: React.FC = () => {
  const { nodes, addNode, reset } = useScriptStore();

  // Form state
  const [id, setId] = useState("");
  const [sceneId, setSceneId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [spriteExpression, setSpriteExpression] = useState("");
  const [nodeType, setNodeType] = useState<"dialogue" | "eventTitle">("dialogue");
  const [eventTitleText, setEventTitleText] = useState("");
  const [textParts, setTextParts] = useState<string[]>([""]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [nextNodeId, setNextNodeId] = useState("");

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("scriptNodes");
    if (stored) useScriptStore.setState({ nodes: JSON.parse(stored) });
    const unsub = useScriptStore.subscribe(store => {
      localStorage.setItem("scriptNodes", JSON.stringify(store.nodes));
    });
    return () => unsub();
  }, []);

  // Handlers for text parts
  const handleAddTextPart = () => setTextParts([...textParts, ""]);
  const handleTextPartChange = (index: number, val: string) => {
    setTextParts(textParts.map((t, i) => (i === index ? val : t)));
  };
  const handleRemoveTextPart = (index: number) => {
    setTextParts(textParts.filter((_, i) => i !== index));
  };

  // Handlers for choices
  const handleAddChoice = () => setChoices([...choices, { text: "", nextStoryNodeId: "" }]);
  const handleChoiceChange = (index: number, field: keyof Choice, val: string) => {
    setChoices(
      choices.map((c, i) =>
        i === index ? { ...c, [field]: val } : c
      )
    );
  };
  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  // Add node to store
  const handleAddNode = () => {
    if (!id || !sceneId) {
      alert("請填寫 ID 和 sceneId 這兩個必要欄位");
      return;
    }
    const node: StoryNode = {
      id,
      nodeType,
      sceneId,
      characterId: characterId || undefined,
      spriteExpression: spriteExpression || undefined,
      text: textParts.length > 1 ? textParts : textParts[0],
      choices: choices.length ? choices : undefined,
      eventTitleText: nodeType === "eventTitle" ? eventTitleText : undefined,
      nextNodeId: nextNodeId || undefined,
    };
    addNode(node);
    // Reset form
    setId("");
    setSceneId("");
    setCharacterId("");
    setSpriteExpression("");
    setNodeType("dialogue");
    setEventTitleText("");
    setTextParts([""]);
    setChoices([]);
    setNextNodeId("");
  };

  // Export JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "storyData.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">腳本節點編輯器</h1>

      {/* Basic Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">ID *</label>
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">場景 sceneId *</label>
          <input
            type="text"
            value={sceneId}
            onChange={e => setSceneId(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">角色 characterId</label>
          <input
            type="text"
            value={characterId}
            onChange={e => setCharacterId(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">表情 spriteExpression</label>
          <input
            type="text"
            value={spriteExpression}
            onChange={e => setSpriteExpression(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Node Type */}
      <div>
        <label className="block mb-1 font-medium">節點類型 nodeType</label>
        <select
          value={nodeType}
          onChange={e => setNodeType(e.target.value as any)}
          className="border rounded p-2"
        >
          <option value="dialogue">對話 / dialogue</option>
          <option value="eventTitle">事件 / eventTitle</option>
        </select>
      </div>
      {nodeType === "eventTitle" && (
        <div>
          <label className="block mb-1 font-medium">事件標題 eventTitleText</label>
          <textarea
            value={eventTitleText}
            onChange={e => setEventTitleText(e.target.value)}
            className="w-full border rounded p-2"
            rows={2}
          />
        </div>
      )}

      {/* Text Parts */}
      <div>
        <label className="block mb-1 font-medium">對話文字 text</label>
        {textParts.map((t, i) => (
          <div key={i} className="flex items-start space-x-2 mb-2">
            <textarea
              value={t}
              onChange={e => handleTextPartChange(i, e.target.value)}
              className="flex-1 border rounded p-2"
              rows={2}
            />
            {textParts.length > 1 && (
              <button
                onClick={() => handleRemoveTextPart(i)}
                className="text-red-500"
              >
                刪除
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddTextPart} className="text-blue-600">
          + 新增段落
        </button>
      </div>

      {/* Choices */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-medium">選項 choices</label>
          <button onClick={handleAddChoice} className="text-blue-600">
            + 新增選項
          </button>
        </div>
        {choices.map((c, i) => (
          <div key={i} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="選項文字"
              value={c.text}
              onChange={e => handleChoiceChange(i, "text", e.target.value)}
              className="border rounded p-2 flex-1"
            />
            <input
              type="text"
              placeholder="跳轉節點ID"
              value={c.nextStoryNodeId}
              onChange={e => handleChoiceChange(i, "nextStoryNodeId", e.target.value)}
              className="border rounded p-2 w-40"
            />
            <button onClick={() => handleRemoveChoice(i)} className="text-red-500">
              刪除
            </button>
          </div>
        ))}
      </div>

      {/* Next Node */}
      <div>
        <label className="block mb-1 font-medium">下一節點 nextNodeId</label>
        <input
          type="text"
          value={nextNodeId}
          onChange={e => setNextNodeId(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddNode}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          加入節點
        </button>
        <button
          onClick={reset}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          清空
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          匯出 JSON
        </button>
      </div>

      {/* Preview */}
      <div>
        <h2 className="text-lg font-medium mb-2">預覽 JSON</h2>
        <pre className="bg-gray-100 p-4 rounded max-h-64 overflow-auto">
          {JSON.stringify(nodes, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ScriptEditor;
