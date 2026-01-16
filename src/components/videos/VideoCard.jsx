import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

export default function VideoCard({ video, onClick }) {
    const getThumbnail = () => {
        if (video.thumbnail_url) return video.thumbnail_url;
        if (video.type === 'youtube' && video.youtube_url) {
            const videoId = video.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';
    };

    const categoryLabels = {
        alongamento: "Alongamento",
        cardio: "Cardio",
        forca: "Força",
        yoga: "Yoga",
        danca: "Dança",
        outro: "Exercício"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="group cursor-pointer"
        >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-lg">
                <img 
                    src={getThumbnail()} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                        <Play className="w-8 h-8 text-emerald-600 ml-1" fill="currentColor" />
                    </div>
                </div>

                {/* Duration badge */}
                {video.duration && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                    </div>
                )}

                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {categoryLabels[video.category] || 'Exercício'}
                </div>
            </div>

            <div className="mt-4 px-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {video.title}
                </h3>
                {video.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {video.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
}