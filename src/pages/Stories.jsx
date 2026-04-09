import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, Mail, MessageCircle } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';
import StoryDetail from './StoryDetail';

const Stories = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('Stories');
            setStories(data.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0)));
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // If a story is selected, show its detail page
    if (selectedStory) {
        return <StoryDetail story={selectedStory} onBack={() => setSelectedStory(null)} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#141414] text-white min-h-screen relative overflow-hidden"
        >
            {/* Custom cursor */}
            <motion.div
                className={`custom-cursor ${isHovering ? 'active' : ''}`}
                animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
                style={{ backgroundColor: '#1a1a1a' }}
            />

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 px-10 py-10 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
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

                <span className="font-display font-light" style={{ fontSize: '13px', letterSpacing: '0.5em' }}>
                    VANSH GUPTA
                </span>

                <span style={{ fontSize: '9px', letterSpacing: '0.4em' }} className="uppercase opacity-40">
                    Real Love Stories
                </span>
            </nav>

            {/* ── HERO HEADER ── */}
            <header className="pt-40 pb-16 px-10 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    style={{ fontSize: '9px', letterSpacing: '0.55em', color: '#999' }}
                    className="uppercase mb-8"
                >
                    Curated Stories
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display italic"
                    style={{
                        fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                        lineHeight: 0.9,
                        letterSpacing: '-0.01em',
                        color: '#ffffff',
                        marginBottom: '3rem',
                    }}
                >
                    Real Love Stories
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1.2 }}
                    style={{ fontSize: '10px', letterSpacing: '0.45em', lineHeight: 2.2, color: '#666' }}
                    className="uppercase max-w-3xl mx-auto"
                >
                    Like a river flows surely to the sea,&nbsp;
                    <span style={{ color: '#b5865a' }}>so it goes</span>&nbsp;
                    some things are&nbsp;
                    <span style={{ color: '#b5865a' }}>meant to be.</span>
                </motion.p>

                <motion.div
                    className="mx-auto mt-16"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', maxWidth: '80px' }}
                />
            </header>

            {/* ── 3-COLUMN MAGAZINE GRID ── */}
            <main className="px-6 md:px-10 pb-32">
                <div className="max-w-screen-xl mx-auto">
                    {stories.length === 0 ? (
                        <div className="text-center py-32">
                            <p style={{ fontSize: '10px', letterSpacing: '0.5em', color: '#bbb' }} className="uppercase">
                                Stories Coming Soon
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16">
                            {stories.map((story, i) => {
                                const couple = story.Couple || story.couple || '';
                                const location = story.Location || story.location || story.Title || story.title || '';
                                const imgSrc = story.Image_URL || story.image || '';

                                // Split couple for styled label: "TRISHA" colored + "NIHAAL" normal
                                const coupleParts = couple.toUpperCase().split(/\s*X\s*/i);

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ delay: (i % 3) * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                        className="group cursor-pointer"
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                        onClick={() => setSelectedStory(story)}
                                    >
                                        {/* ── PHOTO (portrait, aspect 4/5) ── */}
                                        <div
                                            className="overflow-hidden relative mb-4"
                                            style={{ aspectRatio: '4/5', backgroundColor: '#e0dbd3' }}
                                        >
                                            {imgSrc && (
                                                <img
                                                    src={imgSrc}
                                                    alt={couple}
                                                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                                                />
                                            )}

                                            {/* Subtle dark overlay */}
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.18) 100%)' }}
                                            />

                                            {/* Hover tint lift */}
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700" />
                                        </div>

                                        {/* ── CAPTION ── */}
                                        <div className="pt-1">
                                            <p
                                                style={{ fontSize: '9px', letterSpacing: '0.3em' }}
                                                className="uppercase flex items-baseline flex-wrap gap-x-1"
                                            >
                                                {/* Couple name: first part warm gold, × separator, second part grey */}
                                                <span style={{ color: '#b5865a' }}>{coupleParts[0]}</span>
                                                {coupleParts[1] && (
                                                    <>
                                                        <span style={{ color: '#999' }}>&nbsp;×&nbsp;</span>
                                                        <span style={{ color: '#b5865a' }}>{coupleParts[1]}</span>
                                                    </>
                                                )}
                                                {location && (
                                                    <>
                                                        <span style={{ color: '#aaa' }}>&nbsp;//&nbsp;</span>
                                                        <span style={{ color: '#888' }}>{location.toUpperCase()}</span>
                                                        <span style={{ color: '#aaa' }}>&nbsp;//</span>
                                                    </>
                                                )}
                                            </p>

                                            {/* Animated underline */}
                                            <div
                                                className="mt-2 h-px transition-all duration-700 origin-left scale-x-0 group-hover:scale-x-100"
                                                style={{ backgroundColor: '#b5865a', width: '100%', opacity: 0.4 }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer
                className="py-16 px-10 flex flex-col items-center gap-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
                <div className="flex gap-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <a href="https://instagram.com/vansh.gupta08" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <Instagram size={16} />
                    </a>
                    <a href="https://wa.me/918982911149" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <MessageCircle size={16} />
                    </a>
                    <a href="mailto:vanshguptasg08@gmail.com" className="transition-colors hover:text-white">
                        <Mail size={16} />
                    </a>
                </div>
                <p style={{ fontSize: '7px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)' }} className="uppercase">
                    © Vansh Gupta
                </p>
            </footer>
        </motion.div>
    );
};

export default Stories;
