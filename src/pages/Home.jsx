import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, MessageCircle, Video, Salad, CalendarCheck, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FeatureCard from '@/components/home/FeatureCard';

export default function Home() {
  const features = [
  {
    icon: Video,
    title: "Vídeos Interativos",
    description: "Exercícios simples para fazer em casa, no seu tempo. Sem equipamentos, sem complicação."
  },
  {
    icon: Salad,
    title: "Assistente de Nutrição",
    description: "Sugestões de refeições práticas e saudáveis com ajuda de inteligência artificial."
  },
  {
    icon: CalendarCheck,
    title: "Acompanhamento Leve",
    description: "Registre sua rotina de forma simples. Sem cobranças, apenas organização."
  }];


  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-emerald-50/30">
          {/* Banner */}
          <div className="max-w-5xl mx-auto px-6 pt-8">
              <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/ee9a81ae0_BANNER.png"
                  alt="Sua nutricionista inteligente"
                  className="w-full h-auto rounded-2xl shadow-lg max-h-[200px] md:max-h-none object-cover md:object-contain"
              />
          </div>

          {/* Hero Section */}
          <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
                <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        Seu bem-estar, do seu jeito
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                        Cuidar de você pode ser
                        <br />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            mais simples do que parece.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Converse com uma assistente de nutrição por IA, receba receitas simples e se movimente 
                        em casa com vídeos interativos feitos para copiar, não para complicar.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={createPageUrl('Videos')} className="w-full sm:w-auto">
                            <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 w-full">

                                <Play className="w-5 h-5 mr-2" />
                                Fazer exercícios com vídeos imersivos
                            </Button>
                        </Link>
                        
                        <Link to={createPageUrl('AssistenteNutricao')} className="w-full sm:w-auto">
                            <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 w-full">

                                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/9e943db00_wpp-2.png"
                  alt="WhatsApp"
                  className="w-5 h-5 mr-2" />

                                Falar com a Assistente de Nutrição
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto px-6 pb-24">
                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12">

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        O que você encontra aqui
                    </h2>
                    <p className="text-gray-500">
                        Ferramentas simples para o dia a dia
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) =>
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={0.4 + index * 0.1} />

          )}
                </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-3xl mx-auto px-6 pb-20">

                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-emerald-200">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Pronto para começar?
                    </h3>
                    <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                        Sem promessas milagrosas. Apenas um caminho mais leve para cuidar da sua saúde.
                    </p>
                    <Link to={createPageUrl('Videos')}>
                        <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300">

                            Começar agora
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8">
                <div className="text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        Desenvolvido com 💚 por
                        <a 
                            href="https://www.agenciathunder.com.br" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block hover:opacity-80 transition-opacity"
                        >
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/e5476b9f0_logo-thunder-rodape.png" 
                                alt="Thunder" 
                                className="h-4 inline-block"
                            />
                        </a>
                    </p>
                </div>
            </footer>
        </div>);

}