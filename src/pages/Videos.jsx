import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Tv, Info, Sparkles } from 'lucide-react';
import VideoCard from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import AddVideoModal from '@/components/videos/AddVideoModal';

export default function Videos() {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [user, setUser] = useState(null);
    const queryClient = useQueryClient();

    const { data: videos = [], isLoading } = useQuery({
        queryKey: ['videos'],
        queryFn: () => base44.entities.Video.list('-created_date'),
    });

    React.useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const handleVideoAdded = () => {
        queryClient.invalidateQueries({ queryKey: ['videos'] });
        setShowAddModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Vídeos Interativos
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Coloque na TV e copie os movimentos
                        </h1>
                        <p className="text-xl text-emerald-50 mb-8">
                            Faça no seu ritmo. Não precisa pausar nem pensar.
                        </p>

                        {/* Info cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <Tv className="w-6 h-6 mb-2" />
                                <p className="text-sm font-medium">
                                    Dica: espelhe a tela do celular ou computador na sua Smart TV para fazer os movimentos com mais conforto
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <Info className="w-6 h-6 mb-2" />
                                <p className="text-sm font-medium">
                                    Os vídeos são feitos para você seguir junto
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Add video button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Seus Vídeos</h2>
                        <p className="text-gray-500 mt-1">Escolha um vídeo e comece a se movimentar</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Vídeo
                        </Button>
                    )}
                </div>

                {/* Videos grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-2xl mb-4" />
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : videos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tv className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum vídeo ainda
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {user?.role === 'admin' 
                                ? 'Adicione seu primeiro vídeo para começar'
                                : 'Nenhum vídeo disponível no momento'}
                        </p>
                        {user?.role === 'admin' && (
                            <Button
                                onClick={() => setShowAddModal(true)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Primeiro Vídeo
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onClick={() => setSelectedVideo(video)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedVideo && (
                    <VideoPlayer
                        video={selectedVideo}
                        onClose={() => setSelectedVideo(null)}
                    />
                )}
                {showAddModal && (
                    <AddVideoModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={handleVideoAdded}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

