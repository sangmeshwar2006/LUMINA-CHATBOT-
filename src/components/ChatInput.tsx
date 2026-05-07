import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-8 pb-10">
      <form 
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-minimal-input rounded-[32px] shadow-sm border border-slate-100 p-2 overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
          className="w-full pl-4 pr-12 py-3 bg-transparent resize-none focus:outline-none text-slate-800 text-[16px] min-h-[56px] placeholder:text-slate-400"
          disabled={disabled}
        />
        
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
              <Plus size={24} />
            </button>
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
              <Image size={24} />
            </button>
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
              <Mic size={24} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={cn(
              "p-2.5 rounded-full transition-all duration-200 ml-1",
              input.trim() && !disabled
                ? "bg-slate-900 text-white shadow-md hover:bg-black scale-100"
                : "bg-transparent text-slate-300"
            )}
          >
            <Send size={24} />
          </button>
        </div>
        
        <AnimatePresence>
          {disabled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center"
            >
               <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                    />
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <p className="text-[10px] text-center text-gray-400 mt-2">
        Gemini Clone can make mistakes, so double-check it.
      </p>
    </div>
  );
};
