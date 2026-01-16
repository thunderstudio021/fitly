import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tv, Timer, Info, Smartphone, Cast } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoPlayer({ video, onClose }) {
    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    // Previne scroll quando o modal está aberto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Fecha com tecla ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto"
        >
            {/* Botão de fechar fixo no topo */}
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-10">
                <Button
                    onClick={onClose}
                    size="icon"
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-2xl"
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>

            <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-6xl space-y-6">
                    {/* Video player */}
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                        {video.type === 'youtube' ? (
                            <iframe
                                src={getYouTubeEmbedUrl(video.youtube_url)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={video.video_url}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        )}
                    </div>

                    {/* Video info */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white space-y-6 pb-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    {video.title}
                                </h2>
                                {video.description && (
                                    <p className="text-gray-300 text-lg">
                                        {video.description}
                                    </p>
                                )}
                            </div>
                            {video.duration && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full whitespace-nowrap">
                                    <Timer className="w-5 h-5" />
                                    <span className="font-medium">{video.duration}</span>
                                </div>
                            )}
                        </div>

                        {/* Como espelhar na TV */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Cast className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-lg font-semibold">Como espelhar na TV</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone className="w-5 h-5 text-blue-400" />
                                        <p className="font-medium text-sm">No celular/tablet:</p>
                                    </div>
                                    <ul className="text-sm text-gray-300 space-y-1 ml-7">
                                        <li>• Conecte na mesma WiFi da TV</li>
                                        <li>• Abra este vídeo</li>
                                        <li>• Toque no ícone de transmitir/cast</li>
                                        <li>• Selecione sua TV</li>
                                    </ul>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tv className="w-5 h-5 text-purple-400" />
                                        <p className="font-medium text-sm">No computador:</p>
                                    </div>
                                    <ul className="text-sm text-gray-300 space-y-1 ml-7">
                                        <li>• Conecte HDMI na TV</li>
                                        <li>• Ou use Chromecast/AirPlay</li>
                                        <li>• Abra em tela cheia (F11)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="grid md:grid-cols-3 gap-3">
                            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
                                <Tv className="w-6 h-6 text-emerald-400 mb-2" />
                                <p className="text-sm font-medium text-emerald-100">
                                    Copie os movimentos da TV
                                </p>
                            </div>
                            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
                                <Timer className="w-6 h-6 text-blue-400 mb-2" />
                                <p className="text-sm font-medium text-blue-100">
                                    Faça no seu ritmo
                                </p>
                            </div>
                            <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
                                <Info className="w-6 h-6 text-purple-400 mb-2" />
                                <p className="text-sm font-medium text-purple-100">
                                    Não precisa pausar
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}