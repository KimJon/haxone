'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder = 'Select...', className = '' }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2563EB]"
      >
        <span className={selectedOption ? 'text-[#0D1117]' : 'text-gray-400'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col" style={{ minWidth: '100%' }}>
          <div className="p-2 border-b border-gray-100 relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 text-sm bg-gray-50 border-transparent rounded focus:outline-none focus:bg-gray-100"
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-500 text-center">No results found</div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-blue-50 ${opt.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {opt.value === value && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
