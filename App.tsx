import React, { useMemo, useState, useEffect } from 'react';
import { ALL_LINKS, CATEGORY_STYLES } from './constants';
import { LinkCategory, LinkItem } from './types';
import LinkCard from './components/LinkCard';
import EarningsToy from './components/EarningsToy';
import { Sun, Moon, Filter, RefreshCcw, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [completedLinks, setCompletedLinks] = useState<Set<string>>(new Set());
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize Theme and Storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const savedLinks = localStorage.getItem('completedLinks');
    if (savedLinks) {
      setCompletedLinks(new Set(JSON.parse(savedLinks)));
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLinkComplete = (id: string) => {
    const newSet = new Set(completedLinks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedLinks(newSet);
    localStorage.setItem('completedLinks', JSON.stringify(Array.from(newSet)));
  };

  const resetProgress = () => {
    if (window.confirm("RESET THE GRIND? This will clear all progress for today.")) {
      setCompletedLinks(new Set());
      localStorage.removeItem('completedLinks');
    }
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    ALL_LINKS.forEach(link => link.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  // Filter links
  const filteredLinks = useMemo(() => {
    if (!selectedTag) return ALL_LINKS;
    return ALL_LINKS.filter(link => link.tags.includes(selectedTag));
  }, [selectedTag]);

  // Group filtered links
  const groupedLinks = useMemo(() => {
    const groups: Partial<Record<LinkCategory, LinkItem[]>> = {};
    Object.values(LinkCategory).forEach(cat => {
      groups[cat] = [];
    });
    
    filteredLinks.forEach(link => {
      if (groups[link.category]) {
        groups[link.category]!.push(link);
      }
    });
    return groups;
  }, [filteredLinks]);

  const totalLinks = ALL_LINKS.length;
  const progress = Math.round((completedLinks.size / totalLinks) * 100);
  const level = Math.floor(completedLinks.size / 10) + 1;

  // Calculate stats for ticker
  const activeCategories = Object.keys(groupedLinks).length;
  const totalPotential = ALL_LINKS.length * 0.05; // Dummy logic for fun ticker

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-[#e5e7eb]'} overflow-hidden`}>
      
      {/* COMPACT HEADER */}
      <div className="shrink-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-black dark:border-gray-600 px-3 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-black dark:bg-white text-white dark:text-black font-black text-lg px-2 transform -rotate-2">
            THE GRIND
          </div>
          
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="text-xs">
              <span className="font-bold text-gray-500">LVL</span>
              <span className="ml-1 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">{level}</span>
            </div>
            <div className="w-24">
              <div className="flex justify-between text-[9px] font-bold uppercase mb-0.5 text-gray-500">
                <span>XP</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker / Marquee for desktop */}
        <div className="hidden lg:flex flex-1 mx-8 overflow-hidden bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 h-7 items-center">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8 text-[10px] font-mono font-bold uppercase text-gray-600 dark:text-gray-300">
            <span>🚀 Tip: Batch open links (Right Click -&gt; Open All)</span>
            <span>💎 Focus on Passive Nodes first</span>
            <span>⚠️ Don't invest what you can't lose</span>
            <span>🔥 Consistency &gt; Intensity</span>
            <span>📈 Compounding is the 8th wonder of the world</span>
            <span>🤖 Use separate browser profiles for airdrops</span>
            <span>🛡️ Use a burner wallet for high risk apps</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={resetProgress}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
            title="Reset Daily Progress"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* FILTER BAR - Ultra slim */}
      <div className="shrink-0 bg-yellow-300 dark:bg-slate-800 border-b-2 border-black dark:border-gray-600 px-3 py-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Filter className="w-3 h-3 text-black dark:text-white shrink-0" />
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-2 py-0.5 text-[10px] font-bold uppercase border transition-all shrink-0 ${
            selectedTag === null ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-50'
          }`}
        >
          ALL
        </button>
        {['Top Tier', 'Passive', 'Hourly', 'Testnet', 'Bandwidth', 'Game', 'Social'].map(tag => (
           <button
           key={tag}
           onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
           className={`px-2 py-0.5 text-[10px] font-bold uppercase border transition-all shrink-0 ${
             selectedTag === tag 
             ? 'bg-indigo-600 text-white border-black' 
             : 'bg-white text-black border-black hover:bg-indigo-50'
           }`}
         >
           {tag}
         </button>
        ))}
      </div>

      {/* MAIN CONTENT - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-gray-100 dark:bg-[#0b1120]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 pb-20">
          {Object.values(LinkCategory).map((category) => {
             const links = groupedLinks[category] || [];
             if (selectedTag && links.length === 0) return null;
             
             return (
              <div key={category} className="h-full min-h-[150px]">
                <LinkCard 
                  category={category} 
                  links={links} 
                  completedIds={completedLinks}
                  onToggleComplete={toggleLinkComplete}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <EarningsToy />
    </div>
  );
};

export default App;