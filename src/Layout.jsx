import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Home, Video, Salad, FileText, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ProfileModal from '@/components/profile/ProfileModal';

export default function Layout({ children, currentPageName }) {
    const navigate = useNavigate();
    const isHomePage = currentPageName === 'Home';
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const handleProfileUpdate = () => {
        base44.auth.me().then(setUser).catch(() => {});
    };

    const menuItems = [
        { name: 'Home', icon: Home, path: createPageUrl('Home') },
        { name: 'Videos', icon: Video, path: createPageUrl('Videos') },
        { name: 'AssistenteNutricao', icon: Salad, path: createPageUrl('AssistenteNutricao') },
        { name: 'MeuAcompanhamento', icon: FileText, path: createPageUrl('MeuAcompanhamento') }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            {!isHomePage && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(-1)}
                                    className="rounded-full hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <Link to={createPageUrl('Home')} className="flex items-center">
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/8fdae1eb5_logo-mobile.png" 
                                    alt="Fitly"
                                    className="h-10 sm:hidden"
                                />
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c00c232ec62428d765152/8fb745de9_logotipo-desktop.png" 
                                    alt="Fitly"
                                    className="h-8 hidden sm:block"
                                />
                            </Link>
                        </div>

                        <button
                            onClick={() => setShowProfile(true)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            {user?.foto_perfil ? (
                                <img
                                    src={user.foto_perfil}
                                    alt="Perfil"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <nav className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPageName === item.name;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">
                                        {item.name === 'AssistenteNutricao' ? 'Nutrição' : 
                                         item.name === 'MeuAcompanhamento' ? 'Acompanhamento' : 
                                         item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Page content */}
            <main>{children}</main>

            {/* Mobile bottom navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
                <div className="grid grid-cols-4 h-16">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPageName === item.name;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center justify-center transition-colors ${
                                    isActive ? 'text-emerald-600' : 'text-gray-400'
                                }`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                user={user}
                onUpdate={handleProfileUpdate}
            />
            </div>
            );
            }

