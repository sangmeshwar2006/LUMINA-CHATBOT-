import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { User, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-6 py-10 px-4 sm:px-6 lg:px-8",
        !isUser && "bg-slate-50/30"
      )}
    >
      <div className="shrink-0 pt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
            <User size={16} />
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-blue-500 to-teal-400 rotate-45" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-4 overflow-hidden">
        <div className="markdown-body prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
