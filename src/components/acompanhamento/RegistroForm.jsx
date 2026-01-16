import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function RegistroForm({ onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [formData, setFormData] = useState({
        data: new Date().toISOString().split('T')[0],
        peso: '',
        medida_cintura: '',
        medida_quadril: '',
        medida_braco: '',
        medida_coxa: '',
        anotacoes: '',
        foto_url: ''
    });

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setFormData(prev => ({ ...prev, foto_url: file_url }));
        } catch (error) {
            console.error('Erro ao enviar foto:', error);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSave = {
                data: formData.data + 'T12:00:00',
                ...(formData.peso && { peso: parseFloat(formData.peso) }),
                ...(formData.medida_cintura && { medida_cintura: parseFloat(formData.medida_cintura) }),
                ...(formData.medida_quadril && { medida_quadril: parseFloat(formData.medida_quadril) }),
                ...(formData.medida_braco && { medida_braco: parseFloat(formData.medida_braco) }),
                ...(formData.medida_coxa && { medida_coxa: parseFloat(formData.medida_coxa) }),
                ...(formData.anotacoes && { anotacoes: formData.anotacoes }),
                ...(formData.foto_url && { foto_url: formData.foto_url })
            };

            await base44.entities.Acompanhamento.create(dataToSave);
            
            setFormData({
                data: new Date().toISOString().split('T')[0],
                peso: '',
                medida_cintura: '',
                medida_quadril: '',
                medida_braco: '',
                medida_coxa: '',
                anotacoes: '',
                foto_url: ''
            });
            
            onSuccess();
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Novo Registro</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                        id="data"
                        type="date"
                        value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="peso">Peso (kg) - opcional</Label>
                        <Input
                            id="peso"
                            type="number"
                            step="0.1"
                            placeholder="Ex: 70.5"
                            value={formData.peso}
                            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <Label className="mb-2 block">Medidas (cm) - todas opcionais</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Cintura"
                                value={formData.medida_cintura}
                                onChange={(e) => setFormData({ ...formData, medida_cintura: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Quadril"
                                value={formData.medida_quadril}
                                onChange={(e) => setFormData({ ...formData, medida_quadril: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Braço"
                                value={formData.medida_braco}
                                onChange={(e) => setFormData({ ...formData, medida_braco: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Coxa"
                                value={formData.medida_coxa}
                                onChange={(e) => setFormData({ ...formData, medida_coxa: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="anotacoes">Anotações sobre sua rotina - opcional</Label>
                    <Textarea
                        id="anotacoes"
                        placeholder="Como foi seu dia? Como está se sentindo?"
                        value={formData.anotacoes}
                        onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
                        rows={4}
                    />
                </div>

                <div>
                    <Label>Foto de progresso - opcional</Label>
                    <div className="mt-2">
                        {formData.foto_url ? (
                            <div className="relative">
                                <img 
                                    src={formData.foto_url} 
                                    alt="Foto de progresso"
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                                    onClick={() => setFormData({ ...formData, foto_url: '' })}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploadingPhoto ? (
                                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                                    ) : (
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {uploadingPhoto ? 'Enviando...' : 'Clique para adicionar foto'}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                    disabled={uploadingPhoto}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        'Salvar Registro'
                    )}
                </Button>
            </form>
        </motion.div>
    );
}