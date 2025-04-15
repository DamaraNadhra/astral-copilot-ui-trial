"use client";

import { Grade } from "@prisma/client";
import { Search, History, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

interface SearchHistoryProps {
  history: { query: string; grade: Grade }[];
  onSelect: ({ text, grade }: { text: string; grade: Grade }) => void;
  isLoading: boolean;
}

function SearchHistory({
  history,
  isLoading,
  onSelect,
}: SearchHistoryProps) {
  if (isLoading) {
    return (
      <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading history...</span>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <History className="h-4 w-4" />
          <span>No search history</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
      {history.map(({ query, grade }, index) => (
        <button
          key={index}
          onClick={(e) => {
            onSelect({ text: query, grade });
          }}
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          <History className="h-4 w-4 text-gray-400" />
          <span>{query}</span>
        </button>
      ))}
    </div>
  );
}

interface SearchBarProps {
  value: { text: string; grade: Grade };
  onChange: (value: any) => void;
  onSubmit: (value: any) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const { data: session } = useSession();

  const user = session?.user;

  const { data: searchHistory, isLoading: isHistoryLoading } =
    api.searchEngine.getSearchHistory.useQuery(
      {
        userId: user?.id!,
      },
      {
        enabled: !!user?.id,
      },
    );
  const [filteredSearchHistory, setFilteredSearchHistory] = useState<
    { query: string; grade: Grade }[]
  >([]);

  useEffect(() => {
    if (searchHistory && searchHistory.length > 0) {
      setFilteredSearchHistory(
        searchHistory.filter((item) =>
          item.query.toLowerCase().includes(value.text.toLowerCase()),
        ),
      );
    }
  }, [searchHistory, value.text]);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (finalValue: { text: string; grade: Grade }) => {
    setIsFocused(false);
    onChange({ text: finalValue.text, grade: finalValue.grade });
    onSubmit({ text: finalValue.text, grade: finalValue.grade });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="relative z-50" ref={searchRef}>
      <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-gray-400">
        <input
          type="text"
          placeholder={placeholder}
          value={value.text}
          onChange={(e) =>
            onChange((prev: any) => ({ ...prev, text: e.target.value }))
          }
          onFocus={() => setIsFocused(true)}
          className="h-12 flex-1 bg-transparent pl-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit({ text: value.text, grade: value.grade });
            }
          }}
        />
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center bg-gray-900 text-white transition duration-200 hover:bg-gray-800"
          onClick={() => handleSubmit({ text: value.text, grade: value.grade })}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      {isFocused && (
        <SearchHistory
          history={filteredSearchHistory}
          onSelect={handleSubmit}
          isLoading={isHistoryLoading}
        />
      )}
    </div>
  );
}
