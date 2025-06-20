import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgents } from '../../../contexts/AgentContext';
import { uaipAPI } from '../../../utils/uaip-api';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Brain,
  Zap,
  Activity,
  Clock,
  Sparkles
} from 'lucide-react';

interface ChatMessage {
  content: string;
  sender: 'user' | string; // 'user' or agent name
  timestamp: string;
  agentId?: string;
  confidence?: number;
  memoryEnhanced?: boolean;
  knowledgeUsed?: number;
}

interface ChatPortalProps {
  className?: string;
}

interface ChatResponse {
  response: string;
  agentName: string;
  confidence: number;
  model: string;
  tokensUsed: number;
  memoryEnhanced: boolean;
  knowledgeUsed: number;
  persona?: {
    name: string;
    role: string;
    personality: Record<string, number>;
    expertise: string[];
    communicationStyle: {
      tone: string;
      formality: string;
      enthusiasm: string;
    };
  };
  conversationContext: {
    messageCount: number;
    hasHistory: boolean;
    contextProvided: boolean;
  };
  timestamp: string;
}

// Conversation management class as suggested in the CHAT_ENDPOINT_GUIDE.md
class AgentConversation {
  constructor(public agentId: string) {
    this.agentId = agentId;
    this.history = [];
    this.context = {};
  }
  
  history: Array<{content: string; sender: string; timestamp: string}> = [];
  context: any = {};
  
  async sendMessage(message: string, additionalContext = {}) {
    const response = await uaipAPI.agents.chat(
      this.agentId, 
      {
        message,
        conversationHistory: this.history.slice(-10), // Keep last 10 messages
        context: { ...this.context, ...additionalContext }
      }
    );
    
    // Add to history
    this.history.push(
      { content: message, sender: 'user', timestamp: new Date().toISOString() },
      { content: response.response, sender: response.agentName, timestamp: response.timestamp }
    );
    
    return response;
  }
  
  setContext(context: any) {
    this.context = { ...this.context, ...context };
  }
  
  clearHistory() {
    this.history = [];
  }
}

export const ChatPortal: React.FC<ChatPortalProps> = ({ className }) => {
  const { agents } = useAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<AgentConversation | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agentList = Object.values(agents);
  const selectedAgent = agentList.find(agent => agent.id === selectedAgentId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-select first agent if available and create conversation
  useEffect(() => {
    if (!selectedAgentId && agentList.length > 0) {
      setSelectedAgentId(agentList[0].id);
    }
  }, [agentList, selectedAgentId]);

  // Create new conversation when agent changes
  useEffect(() => {
    if (selectedAgentId) {
      const newConversation = new AgentConversation(selectedAgentId);
      setConversation(newConversation);
      setMessages([]); // Clear messages when switching agents
      setError(null);
    }
  }, [selectedAgentId]);

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !conversation || isLoading) return;

    const messageText = currentMessage.trim();
    const userMessage: ChatMessage = {
      content: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Use the conversation management class
      const chatData = await conversation.sendMessage(messageText);

      const agentMessage: ChatMessage = {
        content: chatData.response,
        sender: chatData.agentName,
        timestamp: chatData.timestamp || new Date().toISOString(),
        agentId: selectedAgentId,
        confidence: chatData.confidence,
        memoryEnhanced: chatData.memoryEnhanced,
        knowledgeUsed: chatData.knowledgeUsed
      };

      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: selectedAgent?.name || 'System',
        timestamp: new Date().toISOString(),
        agentId: selectedAgentId
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, conversation, selectedAgentId, selectedAgent, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    if (conversation) {
      conversation.clearHistory();
    }
  }, [conversation]);

  const setContext = useCallback((context: any) => {
    if (conversation) {
      conversation.setContext(context);
    }
  }, [conversation]);

  return (
    <div className={`flex flex-col h-full space-y-4 ${className}`}>
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 30px rgba(6, 182, 212, 0.4)',
                  '0 0 20px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">Agent Chat</h3>
              <p className="text-sm text-slate-400">
                {selectedAgent ? `Chatting with ${selectedAgent.name}` : 'Select an agent to start chatting'}
              </p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Agent Selector */}
        {agentList.length > 0 && (
          <div className="mt-4">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="">Select an agent...</option>
              {agentList.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {/* Chat Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center h-32"
                >
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">
                      {selectedAgent ? `Start a conversation with ${selectedAgent.name}` : 'Select an agent to begin chatting'}
                    </p>
                  </div>
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-auto'
                          : 'bg-slate-700/50 text-white border border-slate-600/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {/* Agent message metadata */}
                      {message.sender !== 'user' && (
                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-600/30 text-xs text-slate-400">
                          {message.confidence && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{Math.round(message.confidence * 100)}%</span>
                            </div>
                          )}
                          {message.memoryEnhanced && (
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              <span>Memory</span>
                            </div>
                          )}
                          {message.knowledgeUsed && message.knowledgeUsed > 0 && (
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>{message.knowledgeUsed} KB</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-500 mt-1 px-3">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 bg-red-500/20 border-t border-red-500/30"
            >
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : "Select an agent first..."}
                  disabled={!conversation || isLoading}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <motion.button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || !conversation || isLoading}
                className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 