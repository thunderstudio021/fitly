import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300"
        >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}