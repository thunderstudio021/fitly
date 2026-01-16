import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Weight, Ruler, FileText, Image } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RegistroCard({ registro }) {
    const hasMedidas = registro.medida_cintura || registro.medida_quadril || 
                       registro.medida_braco || registro.medida_coxa;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Data do registro</p>
                    <p className="font-semibold text-gray-900">
                        {format(new Date(registro.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {registro.peso && (
                    <div className="flex items-center gap-3">
                        <Weight className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Peso</p>
                            <p className="font-medium text-gray-900">{registro.peso} kg</p>
                        </div>
                    </div>
                )}

                {hasMedidas && (
                    <div className="flex items-start gap-3">
                        <Ruler className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">Medidas</p>
                            <div className="grid grid-cols-2 gap-2">
                                {registro.medida_cintura && (
                                    <p className="text-sm text-gray-700">
                                        Cintura: <span className="font-medium">{registro.medida_cintura} cm</span>
                                    </p>
                                )}
                                {registro.medida_quadril && (
                                    <p className="text-sm text-gray-700">
                                        Quadril: <span className="font-medium">{registro.medida_quadril} cm</span>
                                    </p>
                                )}
                                {registro.medida_braco && (
                                    <p className="text-sm text-gray-700">
                                        Braço: <span className="font-medium">{registro.medida_braco} cm</span>
                                    </p>
                                )}
                                {registro.medida_coxa && (
                                    <p className="text-sm text-gray-700">
                                        Coxa: <span className="font-medium">{registro.medida_coxa} cm</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {registro.anotacoes && (
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">Anotações</p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {registro.anotacoes}
                            </p>
                        </div>
                    </div>
                )}

                {registro.foto_url && (
                    <div className="flex items-start gap-3">
                        <Image className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">Foto de progresso</p>
                            <img 
                                src={registro.foto_url} 
                                alt="Progresso"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}