import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, User, Mail, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        foto_perfil: user?.foto_perfil || '',
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
    });

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setFormData(prev => ({ ...prev, foto_perfil: file_url }));
        } catch (error) {
            console.error('Erro ao enviar foto:', error);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updateData = {
                full_name: formData.full_name,
                foto_perfil: formData.foto_perfil
            };

            if (formData.nova_senha) {
                if (formData.nova_senha !== formData.confirmar_senha) {
                    alert('As senhas não coincidem');
                    setLoading(false);
                    return;
                }
                updateData.password = formData.nova_senha;
            }

            await base44.auth.updateMe(updateData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        base44.auth.logout();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Meu Perfil</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Foto de Perfil */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                {formData.foto_perfil ? (
                                    <img
                                        src={formData.foto_perfil}
                                        alt="Perfil"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center border-4 border-emerald-100">
                                        <User className="w-12 h-12 text-white" />
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 border border-gray-200">
                                    {uploadingPhoto ? (
                                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 text-emerald-600" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                        disabled={uploadingPhoto}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Clique no ícone para alterar a foto</p>
                        </div>

                        {/* Nome */}
                        <div>
                            <Label htmlFor="full_name">
                                <User className="w-4 h-4 inline mr-2" />
                                Nome
                            </Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={user?.email || ''}
                                disabled
                                className="mt-1 bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                        </div>

                        {/* Alterar Senha */}
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Lock className="w-4 h-4 mr-2" />
                                Alterar Senha
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="nova_senha" className="text-sm">Nova Senha</Label>
                                    <Input
                                        id="nova_senha"
                                        type="password"
                                        value={formData.nova_senha}
                                        onChange={(e) => setFormData({ ...formData, nova_senha: e.target.value })}
                                        placeholder="Digite a nova senha"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirmar_senha" className="text-sm">Confirmar Senha</Label>
                                    <Input
                                        id="confirmar_senha"
                                        type="password"
                                        value={formData.confirmar_senha}
                                        onChange={(e) => setFormData({ ...formData, confirmar_senha: e.target.value })}
                                        placeholder="Confirme a nova senha"
                                        className="mt-1"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Deixe em branco se não quiser alterar a senha</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 space-y-3">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair da Conta
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}