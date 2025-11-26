import React, { useState } from 'react';
import { LinkItem, LinkCategory } from '../types';
import { Copy, ExternalLink, Check, CheckSquare, Square, Star, Info } from 'lucide-react';
import { CATEGORY_STYLES } from '../constants';

interface LinkCardProps {
  category: LinkCategory;
  links: LinkItem[];
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ category, links, completedIds, onToggleComplete }) => {
  const [copied, setCopied] = useState(false);
  const styles = CATEGORY_STYLES[category] || { color: 'bg-gray-500', desc: '', icon: '' };

  const copyAllLinks = () => {
    const allUrls = links.map(l => l.url).join('\n');
    navigator.clipboard.writeText(allUrls);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = links.filter(l => completedIds.has(l.id)).length;
  const isAllDone = completedCount === links.length && links.length > 0;

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 border-2 border-black dark:border-gray-600 shadow-neo hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all overflow-hidden`}>
      {/* Compact Header */}
      <div className={`${styles.color} p-1.5 flex justify-between items-center text-white border-b-2 border-black dark:border-gray-600`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <h2 className="text-xs font-black uppercase tracking-tight truncate whitespace-nowrap" title={category}>
            {category.split('(')[0]}
          </h2>
          <span className="text-[9px] font-mono bg-black/20 px-1 rounded">
            {completedCount}/{links.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="group relative">
             <Info className="w-3 h-3 cursor-help opacity-70 hover:opacity-100" />
             <div className="absolute right-0 top-full mt-1 w-48 bg-black text-white text-[10px] p-2 rounded z-20 hidden group-hover:block shadow-lg">
               {styles.desc}
             </div>
          </div>
          <button
            onClick={copyAllLinks}
            className="p-1 hover:bg-black/20 rounded transition-colors"
            title="Copy All URLs"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Dense List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-900 scrollbar-thin">
        {links.map((link) => {
          const isDone = completedIds.has(link.id);
          return (
            <div
              key={link.id}
              className={`group flex items-center border-b border-gray-100 dark:border-gray-800 hover:bg-yellow-50 dark:hover:bg-slate-800 transition-colors ${isDone ? 'opacity-40 bg-gray-50 dark:bg-slate-900' : ''}`}
            >
              <button
                onClick={() => onToggleComplete(link.id)}
                className="p-1.5 focus:outline-none"
                aria-label="Mark as done"
              >
                {isDone ? (
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white" />
                )}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => !isDone && onToggleComplete(link.id)}
                className="flex-1 min-w-0 py-1 pr-1 block"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className={`text-[11px] font-bold truncate leading-tight ${isDone ? 'line-through decoration-gray-400' : 'text-slate-900 dark:text-gray-200'}`}>
                      {link.title}
                    </span>
                    {link.recommended && !isDone && (
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-600 flex-shrink-0" />
                    )}
                  </div>
                  {link.tags && (
                    <div className="hidden group-hover:flex gap-0.5">
                      {link.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[8px] uppercase font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </div>
          );
        })}
      </div>
      
       {isAllDone && (
         <div className="bg-emerald-500 text-white text-center py-0.5 text-[9px] font-black uppercase tracking-widest">
           COMPLETE
         </div>
       )}
    </div>
  );
};

export default LinkCard;