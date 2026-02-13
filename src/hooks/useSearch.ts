import { useState, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export function useSearch() {
  const { searchTerm, setSearchTerm } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    isSearchFocused,
    setIsSearchFocused,
    handleSearchChange,
    clearSearch,
  };
}
