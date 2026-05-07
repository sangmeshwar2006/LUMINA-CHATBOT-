import React, { useState, useEffect, useRef } from 'react';
import { Menu, Star, Moon, Sun, MoreVertical, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { Message, ChatSession, Role } from './types';
import { ai, CHAT_MODEL } from './lib/gemini';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gemini_clone_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('gemini_clone_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSend = async (content: string) => {
    let currentId = activeSessionId;
    
    // Create session if none active
    if (!currentId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      currentId = newSession.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Update session title if it's the first message
    setSessions(prev => prev.map(s => {
      if (s.id === currentId) {
        const isFirstMessage = s.messages.length === 0;
        return {
          ...s,
          title: isFirstMessage ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : s.title,
          messages: [...s.messages, userMessage],
          updatedAt: Date.now(),
        };
      }
      return s;
    }));

    setIsTyping(true);

    try {
      const history = (activeSession?.messages || []).map(m => ({
        role: m.role as "user" | "model",
        parts: [{ text: m.content }]
      }));

      const chat = ai.chats.create({
        model: CHAT_MODEL,
        config: {
          systemInstruction: "You are Gemini, a helpful and conversational AI from Google. You provide clear, concise, and accurate information. You support markdown formatting including code blocks, lists, and tables. Keep your personality professional but friendly.",
        },
        history: history,
      });

      const responseStream = await chat.sendMessageStream({ message: content });
      
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
      };

      // Add empty bot message first
      setSessions(prev => prev.map(s => 
        s.id === currentId 
          ? { ...s, messages: [...s.messages, botMessage] } 
          : s
      ));

      let fullContent = "";
      for await (const chunk of responseStream) {
        const text = (chunk as GenerateContentResponse).text || "";
        fullContent += text;
        
        setSessions(prev => prev.map(s => {
          if (s.id === currentId) {
            const updatedMessages = s.messages.map(m => 
              m.id === botMessageId ? { ...m, content: fullContent } : m
            );
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      }

    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: "I'm sorry, I encountered an error. Please make sure your API key is correctly configured.",
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => 
        s.id === currentId 
          ? { ...s, messages: [...s.messages, errorMessage] } 
          : s
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-minimal-bg transition-colors duration-200 text-slate-800">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId || undefined}
        onNewChat={createNewSession}
        onSelectSession={setActiveSessionId}
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-slate-900">
                Lumina
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Star size={18} />
            </button>
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-12">
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                 <h1 className="text-5xl font-semibold mb-4 text-slate-900 tracking-tight">
                    Hello, User
                 </h1>
                 <p className="text-3xl text-slate-300 font-medium tracking-tight">
                    How can I help you today?
                 </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-8">
                {[
                  "Plan a 3-day trip to Tokyo",
                  "Explain quantum computing simply",
                  "Write a Python script to scrape a website",
                  "Give me some fun facts about space"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl text-left text-sm text-slate-600 hover:shadow-sm transition-all flex flex-col justify-between h-32 group"
                  >
                    <span>{suggestion}</span>
                    <div className="self-end p-2 bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-500 rounded-full transition-colors">
                      <Plus size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-8 pb-12">
              {activeSession.messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} className="h-20" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-minimal-bg pt-4">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </main>
    </div>
  );
};

export default App;
