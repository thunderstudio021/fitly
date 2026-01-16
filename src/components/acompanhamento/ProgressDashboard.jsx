import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Award, Zap, Heart, Calendar } from 'lucide-react';

export default function ProgressDashboard({ registros }) {
    if (registros.length === 0) return null;

    const registrosComPeso = registros.filter(r => r.peso);
    
    if (registrosComPeso.length === 0) return null;

    const pesoInicial = registrosComPeso[registrosComPeso.length - 1].peso;
    const pesoAtual = registrosComPeso[0].peso;
    const perdaPeso = pesoInicial - pesoAtual;
    const diasRegistrados = registros.length;

    const motivationalTips = [
        {
            icon: Zap,
            text: "Use os vídeos interativos diariamente para manter a constância"
        },
        {
            icon: Heart,
            text: "Converse com a Assistente de Nutrição para sugestões de refeições práticas"
        },
        {
            icon: Calendar,
            text: "Registre seu progresso regularmente, mesmo nos dias mais difíceis"
        }
    ];

    return (
        <div className="space-y-4 mb-8">
            {/* Cards de Progresso */}
            <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-emerald-100 text-sm mb-1">Peso perdido</p>
                    <p className="text-3xl font-bold">
                        {Math.abs(perdaPeso).toFixed(1)} kg
                    </p>
                    {perdaPeso > 0 && (
                        <p className="text-emerald-100 text-xs mt-2">
                            De {pesoInicial} kg para {pesoAtual} kg
                        </p>
                    )}
                    {perdaPeso < 0 && (
                        <p className="text-emerald-100 text-xs mt-2">
                            Você ganhou {Math.abs(perdaPeso).toFixed(1)} kg
                        </p>
                    )}
                    {perdaPeso === 0 && (
                        <p className="text-emerald-100 text-xs mt-2">
                            Peso mantido
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Registros feitos</p>
                    <p className="text-3xl font-bold text-gray-900">{diasRegistrados}</p>
                    <p className="text-gray-400 text-xs mt-2">
                        Continue assim!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Peso atual</p>
                    <p className="text-3xl font-bold text-gray-900">{pesoAtual} kg</p>
                    <p className="text-gray-400 text-xs mt-2">
                        Último registro
                    </p>
                </motion.div>
            </div>

            {/* Dicas Motivacionais */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6"
            >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    Dicas para potencializar seus resultados
                </h3>
                <div className="space-y-3">
                    {motivationalTips.map((tip, idx) => {
                        const Icon = tip.icon;
                        return (
                            <div key={idx} className="flex items-start gap-3 text-sm">
                                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <p className="text-gray-700 leading-relaxed">{tip.text}</p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}