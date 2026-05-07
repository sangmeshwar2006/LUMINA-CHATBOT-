import React from 'react';
import { MessageSquare, Plus, Settings, History, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatSession } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onNewChat, 
  onSelectSession,
  isOpen
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      className="bg-minimal-sidebar h-screen overflow-hidden flex flex-col border-r border-slate-100 z-20"
    >
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 px-4 py-3 bg-[#e9eef6] hover:bg-[#dde3ea] transition-colors rounded-full text-slate-600 font-medium text-sm mb-4"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        <div className="mb-4">
          <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent</h3>
          <div className="space-y-1">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 hover:bg-[#e2e7ed] rounded-lg text-sm text-left transition-colors",
                  activeSessionId === session.id 
                    ? "bg-[#e2e7ed] text-slate-900 font-medium" 
                    : "text-slate-600"
                )}
              >
                <MessageSquare size={16} className="shrink-0 opacity-50" />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1 border-t border-gray-200">
        {[
          { icon: <History size={18} />, label: "Activity" },
          { icon: <Settings size={18} />, label: "Settings" },
          { icon: <HelpCircle size={18} />, label: "Help" },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e6eaf1] rounded-full transition-colors">
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </motion.aside>
  );
};
