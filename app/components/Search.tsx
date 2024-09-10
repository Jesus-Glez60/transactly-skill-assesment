'use client';
import { ChangeEvent, useState } from 'react';
import Results from './Results';

export default function Search() {
  const [inputValue, setValue] = useState<string>();
  const [showResults, setShowResults] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setShowResults(true);
  };

  const handleSearch = (query: string | undefined) => {
    setValue(query);
    setShowResults(false);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0 flex-col items-center justify-center gap-4">
      <input
        type="text"
        placeholder="Search..."
        className="min-w-96 rounded-md border border-gray-300 p-2"
        value={inputValue ?? ''}
        onChange={handleChange}
      />

      {showResults && <Results query={inputValue} onSearch={handleSearch} />}
    </div>
  );
}
