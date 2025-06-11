
import React, { useState, useMemo, useCallback } from 'react';
import { MORSE_CODE_MAP, CHARACTER_SETS } from '../constants';
import { MorseCodeMap, CharacterSet } from '../types';
import useMorsePlayer from '../hooks/useMorsePlayer';
import IconButton from './IconButton';
import PlayArrowIcon from './icons/PlayArrowIcon';
import TextField from './TextField';
import SearchIcon from './icons/SearchIcon';

interface ReferenceListProps {
  dotDuration: number;
  soundEnabled: boolean;
}

type TabCategory = 'all' | 'letters' | 'numbers' | 'punctuation';

interface TabDefinition {
  id: TabCategory;
  label: string;
  category?: 'letters' | 'numbers' | 'punctuation';
}

const TABS: TabDefinition[] = [
  { id: 'all', label: 'All' },
  ...CHARACTER_SETS.map(cs => ({ id: cs.id as TabCategory, label: cs.name, category: cs.id })),
];

const ReferenceList: React.FC<ReferenceListProps> = ({ dotDuration, soundEnabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [activeMorse, setActiveMorse] = useState<string | null>(null);
  const { isPlaying, playMorse } = useMorsePlayer(dotDuration, soundEnabled);

  const handlePlayMorse = (morse: string) => {
    if (isPlaying && activeMorse === morse) return;
    setActiveMorse(morse);
    playMorse(morse, () => setActiveMorse(null));
  };

  const filteredItems = useMemo(() => {
    let items = MORSE_CODE_MAP;

    // Filter by active tab
    const currentTabInfo = TABS.find(t => t.id === activeTab);
    if (currentTabInfo && currentTabInfo.category) {
      items = items.filter(item => item.category === currentTabInfo.category);
    }

    // Filter by search term
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return items;
    return items.filter(
      (item) =>
        item.char.toLowerCase().includes(lowerSearchTerm) ||
        item.morse.includes(lowerSearchTerm) ||
        item.mnemonic.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, activeTab]);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-1">Morse Code Reference</h2>
      
      {/* M3 Tabs */}
      <div className="flex border-b border-[var(--md-sys-color-outline-variant)] mb-4 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`
              py-3 px-4 text-sm font-medium relative flex-shrink-0 
              hover:bg-[color-mix(in_srgb,var(--md-sys-color-surface-variant),transparent_92%)] 
              focus:outline-none focus-visible:bg-[color-mix(in_srgb,var(--md-sys-color-surface-variant),transparent_90%)]
              transition-colors duration-150 rounded-t-[var(--md-sys-shape-corner-sm)]
              ${activeTab === tab.id 
                ? 'text-[var(--md-sys-color-primary)]' 
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--md-sys-color-primary)] rounded-t-sm"></span>
            )}
          </button>
        ))}
      </div>

      <TextField
        id="search-reference"
        label="Search by character, Morse, or mnemonic"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leadingIcon={<SearchIcon className="w-5 h-5" />}
        containerClassName="mb-4 flex-shrink-0"
      />

      {!soundEnabled && (
         <p 
           className="text-center text-sm mb-4 p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] flex-shrink-0"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
           Sound is currently disabled. Enable it in settings to hear Morse code.
         </p>
      )}

      {filteredItems.length === 0 && (
        <p className="text-center text-[var(--md-sys-color-on-surface-variant)] mt-4">No items match your search or filter.</p>
      )}

      <div className="flex-grow space-y-3 overflow-y-auto pr-1 pb-1"> {/* Adjusted padding for scrollbar */}
        {filteredItems.map((item: MorseCodeMap) => (
          <div // M3 Card styling
            key={item.char}
            className={`
              flex items-center justify-between p-4 
              bg-[var(--md-sys-color-surface-container)] 
              rounded-[var(--md-sys-shape-corner-lg)] /* M3 Card like corner */
              border border-[var(--md-sys-color-outline-variant)]
              transition-all duration-150 ease-out
              shadow-sm hover:shadow-md 
              ${activeMorse === item.morse && isPlaying ? 'ring-2 ring-[var(--md-sys-color-primary)] shadow-lg' : ''}
            `}
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center flex-grow min-w-0"> {/* Ensure content can shrink */}
              <span className="text-3xl font-bold w-12 text-center text-[var(--md-sys-color-primary)] flex-shrink-0">{item.char}</span>
              <div className="ml-4 flex-grow min-w-0">
                 <span className="block text-2xl font-mono tracking-wider text-[var(--md-sys-color-on-surface)] truncate">{item.morse}</span>
                 <span className="block text-xs text-[var(--md-sys-color-on-surface-variant)] truncate">{item.mnemonic}</span>
              </div>
            </div>
            <IconButton
                variant="standard"
                onClick={() => handlePlayMorse(item.morse)}
                disabled={isPlaying && activeMorse !== item.morse}
                aria-label={`Play Morse code for ${item.char}`}
                className="ml-2 flex-shrink-0"
            >
              <PlayArrowIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceList;
