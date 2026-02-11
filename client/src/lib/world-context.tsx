import React, { createContext, useContext, useEffect, useState } from "react";
import { Entry, Category } from "./types";

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

interface WorldContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, "id" | "createdAt" | "updatedAt">) => void;
  updateEntry: (id: string, entry: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => Entry | undefined;
  getEntriesByCategory: (category: Category) => Entry[];
  searchEntries: (query: string) => Entry[];
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

const MOCK_INITIAL_DATA: Entry[] = [
  {
    id: "1",
    title: "The Iron Spire",
    category: "locations",
    tags: ["capital", "landmark"],
    content: "The Iron Spire is the central tower of the High City, visible from leagues away. It serves as both a navigational beacon and the seat of the Grand Council.\n\nConstructed from a mysterious black metal that absorbs light, it is said to predate the current civilization.",
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Elyra Vance",
    category: "characters",
    tags: ["protagonist", "mage"],
    content: "Elyra is a rogue scholar from the lower districts, obsessed with the ancient texts found in the sunken library. She possesses a rare talent for deciphering the Precursor runes.",
    relations: [{ targetId: "1", type: "Resident of" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("codex-entries");
      return saved ? JSON.parse(saved) : MOCK_INITIAL_DATA;
    }
    return MOCK_INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem("codex-entries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (data: Omit<Entry, "id" | "createdAt" | "updatedAt">) => {
    const newEntry: Entry = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, data: Partial<Entry>) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, ...data, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getEntry = (id: string) => entries.find((e) => e.id === id);

  const getEntriesByCategory = (category: Category) =>
    entries.filter((e) => e.category === category);

  const searchEntries = (query: string) => {
    const lower = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.content.toLowerCase().includes(lower) ||
        e.tags.some((t) => t.toLowerCase().includes(lower))
    );
  };

  return (
    <WorldContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        getEntriesByCategory,
        searchEntries,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
}

export function useWorld() {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error("useWorld must be used within a WorldProvider");
  }
  return context;
}
