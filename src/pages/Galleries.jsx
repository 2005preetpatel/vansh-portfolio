import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, MessageCircle, X, Play, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';

const Galleries = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [items, setItems] = useState([]);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('Galleries');
            const filtered = data.filter(item => {
                const url = (item.URL || item.url || '').trim();
                return url !== '' && !url.includes('bing.net') && !url.includes('bing.com');
            });
            setItems(filtered.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0)));
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Lightbox functions
    const openLightbox = (index) => {
        setLightbox({ open: true, index });
        setIsZoomed(false);
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        setLightbox(l => ({ ...l, open: false }));
        setIsZoomed(false);
        document.body.style.overflow = '';
    };
    const lightboxNext = () => {
        setLightbox(l => ({ ...l, index: (l.index + 1) % items.length }));
        setIsZoomed(false);
    };
    const lightboxPrev = () => {
        setLightbox(l => ({ ...l, index: (l.index - 1 + items.length) % items.length }));
        setIsZoomed(false);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKey = (e) => {
            if (!lightbox.open || items.length === 0) return;
            if (e.key === 'Escape') {
                if (isZoomed) setIsZoomed(false);
                else closeLightbox();
            }
            if (e.key === 'ArrowRight') lightboxNext();
            if (e.key === 'ArrowLeft') lightboxPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightbox.open, items.length, isZoomed]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="bg-[#141414] text-white min-h-screen relative overflow-x-hidden pt-32 pb-20 px-10"
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
                        className={`${item.Span || item.span} group relative overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => openLightbox(i)}
                    >
                        <img
                            src={item.URL || item.url}
                            alt={`Gallery item ${i + 1}`}
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

            {/* Fullscreen Lightbox */}
            <AnimatePresence>
                {lightbox.open && items.length > 0 && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.96)' }}
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        {!isZoomed && (
                            <button
                                onClick={closeLightbox}
                                className="absolute top-6 right-6 z-20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-full"
                                style={{ width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <X size={16} className="text-white" />
                            </button>
                        )}

                        {/* Image counter */}
                        {!isZoomed && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20" style={{ fontSize: '9px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)' }}>
                                {lightbox.index + 1} / {items.length}
                            </div>
                        )}

                        {/* Prev arrow */}
                        {!isZoomed && (
                            <button
                                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                                style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.15)' }}
                            >
                                <ChevronLeft size={20} className="text-white" />
                            </button>
                        )}

                        {/* Next arrow */}
                        {!isZoomed && (
                            <button
                                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                                style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.15)' }}
                            >
                                <ChevronRight size={20} className="text-white" />
                            </button>
                        )}

                        {/* Thumbnail strip at bottom */}
                        {!isZoomed && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[80vw] pb-2 z-20">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: i })); setIsZoomed(false); }}
                                        className="cursor-pointer overflow-hidden transition-all duration-300 flex-shrink-0"
                                        style={{
                                            width: '48px', height: '32px',
                                            border: i === lightbox.index ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                                            opacity: i === lightbox.index ? 1 : 0.4,
                                            position: 'relative'
                                        }}
                                    >
                                        {(item.Type === 'video' || item.type === 'video') ? (
                                            <>
                                                <video src={item.URL || item.url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Play size={10} className="text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <img src={item.URL || item.url} alt="" className="w-full h-full object-cover grayscale" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main media */}
                        <motion.div
                            key={lightbox.index}
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className={`absolute inset-0 flex items-center justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                        >
                            {(items[lightbox.index]?.Type === 'video' || items[lightbox.index]?.type === 'video') ? (
                                <video
                                    src={items[lightbox.index]?.URL || items[lightbox.index]?.url}
                                    controls={!isZoomed}
                                    autoPlay
                                    muted={isZoomed}
                                    loop={isZoomed}
                                    className={`${isZoomed ? "min-w-full min-h-full object-cover" : "max-w-[88vw] max-h-[85vh] object-contain"} transition-all duration-500 ease-in-out block`}
                                />
                            ) : (
                                <img
                                    src={items[lightbox.index]?.URL || items[lightbox.index]?.url}
                                    alt={items[lightbox.index]?.Caption || ''}
                                    className={`${isZoomed ? "min-w-full min-h-full object-cover" : "max-w-[88vw] max-h-[85vh] object-contain"} transition-all duration-500 ease-in-out block`}
                                />
                            )}
                            {/* Caption */}
                            {!isZoomed && items[lightbox.index]?.Caption && (
                                <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
                                    <p style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.4)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }} className="uppercase font-display">
                                        {items[lightbox.index].Caption}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
