import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Info } from 'lucide-react';
import RegistroForm from '@/components/acompanhamento/RegistroForm';
import RegistroCard from '@/components/acompanhamento/RegistroCard';
import ProgressDashboard from '@/components/acompanhamento/ProgressDashboard';

export default function MeuAcompanhamento() {
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const { data: registros, isLoading } = useQuery({
        queryKey: ['acompanhamento', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            return base44.entities.Acompanhamento.filter({ created_by: user.email }, '-data');
        },
        initialData: [],
        enabled: !!user?.email
    });

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['acompanhamento'] });
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Meu Acompanhamento</h1>
                    </div>
                    
                    {/* Mensagem de incentivo */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-900 font-medium mb-1">
                                Seu progresso, seu jeito
                            </p>
                            <p className="text-sm text-blue-700">
                                Este é um espaço pessoal para você se acompanhar sem cobranças. 
                                Registre o que fizer sentido para você - peso, medidas, fotos ou apenas suas anotações.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard de Progresso */}
                <ProgressDashboard registros={registros} />

                {/* Botão adicionar */}
                {!showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6"
                    >
                        <Button
                            onClick={() => setShowForm(true)}
                            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Novo Registro
                        </Button>
                    </motion.div>
                )}

                {/* Formulário */}
                {showForm && (
                    <div className="mb-6">
                        <RegistroForm onSuccess={handleSuccess} />
                        <Button
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="mt-3"
                        >
                            Cancelar
                        </Button>
                    </div>
                )}

                {/* Lista de registros */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Carregando...</div>
                    ) : registros.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Ainda não há registros. Comece agora!</p>
                        </div>
                    ) : (
                        registros.map((registro) => (
                            <RegistroCard key={registro.id} registro={registro} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

