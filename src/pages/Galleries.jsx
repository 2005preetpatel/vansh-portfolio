import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, MessageCircle, X, Play, ArrowLeft } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';

const Galleries = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('Galleries');
            setItems(data.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0)));
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="bg-black text-white min-h-screen relative overflow-x-hidden pt-32 pb-20 px-10"
        >
            {/* Custom Cursor */}
            <motion.div
                className={`custom-cursor ${isHovering ? 'active' : ''}`}
                animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
            />

            <div className="film-grain" />

            {/* Header */}
            <nav className="fixed top-0 w-full z-50 px-10 py-10 flex justify-between items-center bg-black/40 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="flex items-center gap-4 group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] tracking-[0.4em] uppercase font-medium">Back</span>
                </button>
                <h2 className="font-display text-xl tracking-[0.4em] font-light">GALLERIES</h2>
                <div className="flex gap-8 text-[9px] tracking-[0.5em] uppercase font-medium opacity-40">
                    <span>Cinematic Works</span>
                </div>
            </nav>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className={`${item.Span || item.span} group relative overflow-hidden bg-neutral-900 border border-white/5`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <img
                            src={item.URL || item.url}
                            alt={`Gallery item ${i}`}
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        />
                        {(item.Type === 'video' || item.type === 'video') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-[8px] tracking-[0.5em] uppercase text-white/40">Item 0{i + 1}</span>
                            <h4 className="text-sm font-display tracking-[0.2em] italic uppercase">{item.Caption || "Visual Story"}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-32 pt-20 border-t border-white/5 flex flex-col items-center">
                <div className="flex gap-16 text-white/20 mb-12">
                    <a
                        href="https://instagram.com/vansh.gupta08"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Instagram size={18} />
                    </a>
                    <a
                        href="https://wa.me/919329668425"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <MessageCircle size={18} />
                    </a>
                    <a
                        href="mailto:vanshguptasg08@gmail.com"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Mail size={18} />
                    </a>
                </div>
                <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 text-white">VANSH GUPTA // ARCHIVE</p>
            </footer>
        </motion.div>
    );
};

export default Galleries;
