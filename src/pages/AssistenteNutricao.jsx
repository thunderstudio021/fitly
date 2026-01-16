import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Salad, Sparkles, MessageCircle, Plus, History, X } from 'lucide-react';
import MessageBubble from '@/components/chat/MessageBubble';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AssistenteNutricao() {
    const [conversation, setConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [showConversations, setShowConversations] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);
    const unsubscribeRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const refreshConversations = async () => {
        try {
            const currentUser = await base44.auth.me();
            const convList = await base44.agents.listConversations({
                agent_name: 'assistente_nutricao',
            });
            const userConversations = convList.filter(conv => conv.created_by === currentUser.email);
            setConversations(userConversations);
        } catch (error) {
            console.error('Erro ao atualizar conversas:', error);
        }
    };

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);
                const convList = await base44.agents.listConversations({
                    agent_name: 'assistente_nutricao',
                });
                const userConversations = convList.filter(conv => conv.created_by === currentUser.email);
                setConversations(userConversations);
                setIsInitializing(false);
            } catch (error) {
                console.error('Erro ao carregar conversas:', error);
                setIsInitializing(false);
            }
        };

        loadConversations();
    }, []);

    const loadConversation = async (convId) => {
        try {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }

            const conv = await base44.agents.getConversation(convId);
            setConversation(conv);
            setMessages(conv.messages || []);
            
            const unsubscribe = base44.agents.subscribeToConversation(convId, (data) => {
                setMessages(data.messages || []);
                refreshConversations();
            });
            
            unsubscribeRef.current = unsubscribe;
            setShowConversations(false);
            await refreshConversations();
        } catch (error) {
            console.error('Erro ao carregar conversa:', error);
        }
    };

    const createNewConversation = async () => {
        try {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }

            const newConversation = await base44.agents.createConversation({
                agent_name: 'assistente_nutricao',
                metadata: {
                    name: 'Nova conversa',
                }
            });
            
            setConversation(newConversation);
            setMessages([]);
            
            const unsubscribe = base44.agents.subscribeToConversation(newConversation.id, (data) => {
                setMessages(data.messages || []);
            });
            
            unsubscribeRef.current = unsubscribe;
            setShowConversations(false);

            await refreshConversations();
        } catch (error) {
            console.error('Erro ao criar nova conversa:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (user?.email) {
                refreshConversations();
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [user]);

    const handleSend = async () => {
        if (!input.trim() || !conversation || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            await base44.agents.addMessage(conversation, {
                role: 'user',
                content: userMessage
            });
            await refreshConversations();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isInitializing) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Preparando sua assistente...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col pb-[180px] md:pb-0">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                                <Salad className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">Assistente de Nutrição</h1>
                                <p className="text-emerald-100 text-xs sm:text-sm">
                                    Refeições simples para uma vida mais saudável
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={() => {
                                    refreshConversations();
                                    setShowConversations(!showConversations);
                                }}
                                variant="outline"
                                className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 border-white/20 text-white"
                            >
                                <History className="w-4 h-4 mr-2" />
                                Conversas
                            </Button>
                            <a 
                                href={base44.agents.getWhatsAppConnectURL('assistente_nutricao')} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none"
                            >
                                <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg border-0">
                                    <img 
                                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/bcf683ee3_logo-whatsapp.png" 
                                        alt="WhatsApp"
                                        className="w-4 h-4 mr-2"
                                    />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversations Sidebar */}
            <AnimatePresence>
                {showConversations && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/30 z-40"
                            onClick={() => setShowConversations(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Conversas</h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowConversations(false)}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <Button
                                    onClick={createNewConversation}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 mb-4"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nova Conversa
                                </Button>

                                <div className="space-y-2">
                                    {conversations.map((conv) => {
                                        const lastMessage = conv.messages?.[conv.messages.length - 1];
                                        const preview = lastMessage?.content?.substring(0, 60) || 'Sem mensagens';
                                        
                                        return (
                                            <button
                                                key={conv.id}
                                                onClick={() => loadConversation(conv.id)}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                                    conversation?.id === conv.id
                                                        ? 'bg-emerald-50 border-emerald-300'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2 mb-1">
                                                    <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {conv.metadata?.name || 'Conversa'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {format(new Date(conv.created_date), "d 'de' MMM, HH:mm", { locale: ptBR })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate ml-6">
                                                    {preview}
                                                </p>
                                            </button>
                                        );
                                    })}
                                    {conversations.length === 0 && (
                                        <p className="text-center text-gray-400 text-sm py-8">
                                            Nenhuma conversa ainda
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-[120px] md:mb-0">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {!conversation ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Salad className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Bem-vindo!
                            </h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Comece uma nova conversa ou abra uma conversa anterior
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={createNewConversation}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nova Conversa
                                </Button>
                                <Button
                                    onClick={() => setShowConversations(true)}
                                    variant="outline"
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    Ver Conversas
                                </Button>
                            </div>
                        </motion.div>
                    ) : messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Salad className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Olá! Como posso te ajudar?
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Estou aqui para sugerir refeições simples e práticas para o seu dia a dia
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                {[
                                    'Preciso de ideias de café da manhã rápido',
                                    'O que posso cozinhar para o almoço?',
                                    'Sugestões de lanches saudáveis',
                                    'Como montar uma marmita fitness?'
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(suggestion)}
                                        className="text-left p-4 rounded-xl bg-white border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-sm text-gray-700 hover:text-emerald-700 font-medium"
                                    >
                                        <Sparkles className="w-4 h-4 inline mr-2 text-emerald-500" />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((message, idx) => (
                                <MessageBubble key={idx} message={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg z-30">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex gap-3">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua pergunta sobre alimentação..."
                            className="resize-none rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-0 min-h-[60px] max-h-[120px]"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 h-[60px]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        A assistente oferece sugestões gerais. Para orientação médica, consulte um profissional.
                    </p>
                </div>
            </div>
        </div>
    );
}
