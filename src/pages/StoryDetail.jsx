import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Instagram, Mail, MessageCircle, MapPin, Heart } from 'lucide-react';

const StoryDetail = ({ story, onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const couple = story.Couple || story.couple || '';
    const location = story.Location || story.location || story.Title || story.title || '';
    const imgSrc = story.Image_URL || story.image || '';
    const videoUrl = story.URL || story.url || '';
    const description = story.Description || story.description || '';

    // Split couple name for styled rendering e.g. "TRISHA X NIHAAL"
    const coupleParts = couple.toUpperCase().split(/\s*X\s*/i);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        // scroll to top on mount
        window.scrollTo(0, 0);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen relative overflow-hidden"
            style={{ backgroundColor: '#f5f1eb', color: '#1a1a1a' }}
        >
            {/* Custom cursor */}
            <motion.div
                className={`custom-cursor ${isHovering ? 'active' : ''}`}
                animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
                style={{ backgroundColor: '#1a1a1a' }}
            />

            {/* Nav */}
            <nav
                className="fixed top-0 w-full z-50 flex justify-between items-center px-10 py-8"
                style={{ backgroundColor: 'rgba(245,241,235,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div
                        className="w-9 h-9 flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white"
                        style={{ border: '1px solid rgba(0,0,0,0.15)' }}
                    >
                        <ArrowLeft size={14} />
                    </div>
                    <span style={{ fontSize: '9px', letterSpacing: '0.4em' }} className="uppercase font-medium opacity-60">Stories</span>
                </button>

                <span className="font-display font-light" style={{ fontSize: '13px', letterSpacing: '0.5em' }}>
                    VANSH GUPTA
                </span>

                <span style={{ fontSize: '9px', letterSpacing: '0.4em' }} className="uppercase opacity-40">
                    {couple}
                </span>
            </nav>

            {/* ── HERO ── */}
            <header className="relative pt-28" style={{ minHeight: '92vh' }}>
                {/* Full-bleed image */}
                <div className="relative overflow-hidden" style={{ height: '82vh' }}>
                    {imgSrc && (
                        <motion.img
                            src={imgSrc}
                            alt={couple}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                    )}
                    {/* Gradient overlay bottom */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(245,241,235,0) 50%, rgba(245,241,235,1) 100%)' }}
                    />

                    {/* Couple name overlaid on hero */}
                    <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            style={{ fontSize: '9px', letterSpacing: '0.55em', color: 'rgba(0,0,0,0.45)' }}
                            className="uppercase mb-3 flex items-center gap-2"
                        >
                            <MapPin size={9} /> {location}
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display italic leading-none"
                            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#1a1a1a' }}
                        >
                            {coupleParts[0]}
                            {coupleParts[1] && (
                                <>
                                    <span style={{ color: '#b5865a', fontStyle: 'normal', fontSize: '0.55em', letterSpacing: '0.3em', verticalAlign: 'middle', margin: '0 0.4em' }}>×</span>
                                    {coupleParts[1]}
                                </>
                            )}
                        </motion.h1>
                    </div>
                </div>
            </header>

            {/* ── STORY BODY ── */}
            <main className="px-10 md:px-20 pb-32 max-w-screen-xl mx-auto">

                {/* Thin divider */}
                <motion.div
                    className="mb-20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.1)', transformOrigin: 'left' }}
                />

                {/* Info row */}
                <div className="flex flex-wrap gap-16 mb-24">
                    <div>
                        <p style={{ fontSize: '8px', letterSpacing: '0.5em', color: '#aaa' }} className="uppercase mb-2">Couple</p>
                        <p style={{ fontSize: '13px', letterSpacing: '0.2em', color: '#b5865a' }} className="uppercase font-medium">{couple}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '8px', letterSpacing: '0.5em', color: '#aaa' }} className="uppercase mb-2">Location</p>
                        <p style={{ fontSize: '13px', letterSpacing: '0.2em', color: '#1a1a1a' }} className="uppercase font-medium">{location}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '8px', letterSpacing: '0.5em', color: '#aaa' }} className="uppercase mb-2">Photography</p>
                        <p style={{ fontSize: '13px', letterSpacing: '0.2em', color: '#1a1a1a' }} className="uppercase font-medium">Vansh Gupta</p>
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '15px', lineHeight: 2, color: 'rgba(0,0,0,0.5)', maxWidth: '620px' }}
                        className="mb-24 font-light"
                    >
                        {description}
                    </motion.p>
                )}

                {/* Watch Film CTA */}
                {videoUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-32"
                    >
                        {/* Film Watch Button */}
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-5"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div
                                className="w-16 h-16 flex items-center justify-center transition-all duration-500 group-hover:bg-neutral-900"
                                style={{ border: '1px solid rgba(0,0,0,0.2)' }}
                            >
                                <Play size={18} className="ml-1 transition-colors duration-500 group-hover:text-white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '8px', letterSpacing: '0.5em', color: '#aaa' }} className="uppercase mb-1">Watch the film</p>
                                <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#1a1a1a' }} className="uppercase font-medium">{couple} Wedding Film</p>
                            </div>
                        </a>
                    </motion.div>
                )}

                {/* Large feature image (repeated for magazine feel) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-6 overflow-hidden"
                    style={{ aspectRatio: '16/9' }}
                >
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt={couple}
                            className="w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-[1.04]"
                        />
                    )}
                </motion.div>

                {/* Photo credit */}
                <p style={{ fontSize: '8px', letterSpacing: '0.4em', color: 'rgba(0,0,0,0.3)' }} className="uppercase text-right mb-32">
                    © Vansh Gupta / {couple}
                </p>

                {/* Bottom quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="text-center py-24"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
                >
                    <Heart size={14} style={{ color: '#b5865a', margin: '0 auto 24px' }} />
                    <p style={{ fontSize: '10px', letterSpacing: '0.45em', lineHeight: 2.4, color: '#888' }} className="uppercase max-w-2xl mx-auto">
                        Like a river flows surely to the sea,&nbsp;
                        <span style={{ color: '#b5865a' }}>so it goes</span>&nbsp;
                        some things are&nbsp;
                        <span style={{ color: '#b5865a' }}>meant to be.</span>
                    </p>
                </motion.div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="py-16 px-10 flex flex-col items-center gap-8" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex gap-10" style={{ color: 'rgba(0,0,0,0.25)' }}>
                    <a href="https://instagram.com/vansh.gupta08" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-900">
                        <Instagram size={16} />
                    </a>
                    <a href="https://wa.me/918982911149" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-900">
                        <MessageCircle size={16} />
                    </a>
                    <a href="mailto:vanshguptasg08@gmail.com" className="transition-colors hover:text-neutral-900">
                        <Mail size={16} />
                    </a>
                </div>
                <p style={{ fontSize: '7px', letterSpacing: '0.4em', color: 'rgba(0,0,0,0.3)' }} className="uppercase">
                    © Vansh Gupta
                </p>
            </footer>
        </motion.div>
    );
};

export default StoryDetail;
