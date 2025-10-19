import { useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onSearch(value);
  };

  return (
    <input
      value={inputValue}
      className={css.input}
      onChange={handleChange}
      type="text"
      placeholder="Search notes"
    />
  );
}
