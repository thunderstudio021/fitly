import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Youtube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';

export default function AddVideoModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [videoType, setVideoType] = useState('youtube');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        category: 'outro',
        youtube_url: '',
        video_url: '',
        thumbnail_url: ''
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setFormData(prev => ({ ...prev, video_url: file_url }));
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await base44.entities.Video.create({
                ...formData,
                type: videoType
            });
            onSuccess();
        } catch (error) {
            console.error('Erro ao criar vídeo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Adicionar Vídeo</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Tabs value={videoType} onValueChange={setVideoType}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="youtube" className="flex items-center gap-2">
                                <Youtube className="w-4 h-4" />
                                YouTube
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Enviar Vídeo
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="youtube" className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="youtube_url">Link do YouTube</Label>
                                <Input
                                    id="youtube_url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.youtube_url}
                                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                    required={videoType === 'youtube'}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="upload" className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="video_file">Arquivo de Vídeo</Label>
                                <div className="mt-2">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {loading ? (
                                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            )}
                                            <p className="text-sm text-gray-500">
                                                {formData.video_url ? 'Vídeo enviado!' : 'Clique para enviar vídeo'}
                                            </p>
                                        </div>
                                        <input
                                            id="video_file"
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={loading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Alongamento Matinal"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Breve descrição do vídeo..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alongamento">Alongamento</SelectItem>
                                    <SelectItem value="cardio">Cardio</SelectItem>
                                    <SelectItem value="forca">Força</SelectItem>
                                    <SelectItem value="yoga">Yoga</SelectItem>
                                    <SelectItem value="danca">Dança</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="duration">Duração (opcional)</Label>
                            <Input
                                id="duration"
                                placeholder="Ex: 15 min"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Adicionar Vídeo'
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}