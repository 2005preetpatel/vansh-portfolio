import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, MessageCircle, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';
import StoryDetail from './StoryDetail';

const Home = ({ onNavigate }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [stories, setStories] = useState([]);
    const [heroBg, setHeroBg] = useState("");
    const [selectedStory, setSelectedStory] = useState(null);
    const [mosaicImages, setMosaicImages] = useState([]);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

    // Fallback placeholder images (used until Google Sheets Mosaic tab is filled)
    const FALLBACK_MOSAIC = [
        { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90', title: 'Wedding Moment' },
        { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=90', title: 'Couple Portrait' },
        { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=90', title: 'Wedding Ceremony' },
        { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=90', title: 'Wedding Details' },
        { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&q=90', title: 'Bridal Portrait' },
    ];

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('Home');
            const backgroundRow = data.find(row => row.Title?.toLowerCase() === 'background');
            if (backgroundRow) setHeroBg(backgroundRow.Image_URL);

            const contentStories = data.filter(row => row.Title?.toLowerCase() !== 'background');
            setStories(contentStories.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0)));
        };
        loadData();

        // Load mosaic images from Mosaic sheet tab
        const loadMosaic = async () => {
            const data = await fetchSheetData('Mosaic');
            if (data && data.length > 0) {
                const imgs = data
                    .sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0))
                    .map(row => ({
                        src: row.Image_URL || row.image || '',
                        title: row.Title || row.title || '',
                    }))
                    .filter(img => img.src);
                if (imgs.length > 0) setMosaicImages(imgs);
            }
        };
        loadMosaic();
    }, []);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKey = (e) => {
            if (!lightbox.open) return;
            if (e.key === 'Escape') setLightbox(l => ({ ...l, open: false }));
            if (e.key === 'ArrowRight') setLightbox(l => ({ ...l, index: (l.index + 1) % displayMosaic.length }));
            if (e.key === 'ArrowLeft') setLightbox(l => ({ ...l, index: (l.index - 1 + displayMosaic.length) % displayMosaic.length }));
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightbox.open]);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Use Google Sheets data if available, otherwise fallback placeholders
    const displayMosaic = mosaicImages.length > 0 ? mosaicImages : FALLBACK_MOSAIC;

    const openLightbox = (index) => {
        setLightbox({ open: true, index });
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        setLightbox(l => ({ ...l, open: false }));
        document.body.style.overflow = '';
    };
    const lightboxNext = () => setLightbox(l => ({ ...l, index: (l.index + 1) % displayMosaic.length }));
    const lightboxPrev = () => setLightbox(l => ({ ...l, index: (l.index - 1 + displayMosaic.length) % displayMosaic.length }));

    // If a story is selected, show its detail page directly
    if (selectedStory) {
        return <StoryDetail story={selectedStory} onBack={() => setSelectedStory(null)} />;
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="bg-black text-white min-h-screen selection:bg-white selection:text-black relative overflow-hidden"
        >
            {/* Custom Cursor */}
            <motion.div
                className={`custom-cursor ${isHovering ? 'active' : ''}`}
                animate={{
                    x: mousePos.x - 4,
                    y: mousePos.y - 4,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
            />

            {/* Film Grain */}
            <div className="film-grain" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-10 py-10 flex justify-between items-center bg-black/60 backdrop-blur-md transition-all duration-500">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-display text-3xl tracking-[0.2em] font-light cursor-pointer text-white"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => onNavigate('splash')}
                >
                    VANSH GUPTA
                </motion.h1>
                <div className="flex gap-16 text-[12px] tracking-[0.5em] uppercase font-medium text-white/70">
                    <button
                        onClick={() => onNavigate('galleries')}
                        className="hover:text-white/50 transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Galleries
                    </button>
                    <button
                        onClick={() => onNavigate('commercials')}
                        className="hover:text-white/50 transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Commercials
                    </button>
                    <button
                        onClick={() => onNavigate('stories')}
                        className="hover:text-white/50 transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Stories
                    </button>
                    <button
                        onClick={() => onNavigate('about')}
                        className="hover:text-white/50 transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        About
                    </button>
                    <button
                        onClick={() => onNavigate('enquire')}
                        className="hover:text-white/50 transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Enquire
                    </button>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: y1, scale }}
                    className="absolute inset-0 z-0 bg-black"
                >
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3FAOOY5VPtG2agl70Y6NTPISETtEcDk_QsK2Ro75F8hUa_-EU_07_na8lLsXRZK23-hO7bQIaF4XjksaGZoptee9uAsP3l__iM23Sh2qOy3dh59ve6_tH29XMzBBqxZ7K1F2NB5s4jMqsqXEpy9ik4Ymqm6724MHgXXMp2oNN7flsuvLhdBeJlhXWLLjXlyZjMyK5UnbG7zkqZ5rfDup512L3DtqH5Vji1FvMBpZsQFNNZHduerlgZZexWukB5l66EIDm0fGdg"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                </motion.div>

                <div className="relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[clamp(2.5rem,10vw,15rem)] font-display leading-[0.85] tracking-tighter mb-12"
                    >
                        You Feel. <br />
                        <span className="italic">I Focus.</span> <br />
                        We Frame
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/60 font-light mt-4"
                    >
                        Director of Photography / Cinematic Storytelling
                    </motion.p>
                </div>


            </header>

            {/* About Section - Dark */}
            <section className="py-64 px-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-end">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <h3 className="text-4xl md:text-5xl font-display uppercase tracking-widest italic mb-16 leading-tight">
                            We are creating <br /> fiction out of reality.
                        </h3>
                        <p className="text-xl leading-relaxed text-white/40 font-light max-w-xl">
                            A wedding is a validation coupled with the showcase of Love. We believe in capturing the chronology of a couple’s journey where they vow together to be One, turning real moments into a cinematic fiction.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="aspect-[4/5] bg-neutral-900 relative group overflow-hidden"
                    >
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3FAOOY5VPtG2agl70Y6NTPISETtEcDk_QsK2Ro75F8hUa_-EU_07_na8lLsXRZK23-hO7bQIaF4XjksaGZoptee9uAsP3l__iM23Sh2qOy3dh59ve6_tH29XMzBBqxZ7K1F2NB5s4jMqsqXEpy9ik4Ymqm6724MHgXXMp2oNN7flsuvLhdBeJlhXWLLjXlyZjMyK5UnbG7zkqZ5rfDup512L3DtqH5Vji1FvMBpZsQFNNZHduerlgZZexWukB5l66EIDm0fGdg"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]"
                            alt="Atmospheric"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="w-24 h-24 rounded-full border border-white/50 flex items-center justify-center text-white"
                            >
                                <Play size={32} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── REAL LOVE STORIES — 3-Column Magazine Grid ── */}
            <section className="bg-black py-32 px-6 md:px-10 border-t border-white/5">
                <div className="max-w-screen-xl mx-auto">

                    {/* Section header */}
                    <div className="text-center mb-20">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: '9px', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.25)' }}
                            className="uppercase mb-8"
                        >
                            Curated Stories
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display italic text-white"
                            style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: '2.5rem' }}
                        >
                            Real Love Stories
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 1.2 }}
                            style={{ fontSize: '10px', letterSpacing: '0.45em', lineHeight: 2.2, color: 'rgba(255,255,255,0.35)' }}
                            className="uppercase max-w-3xl mx-auto"
                        >
                            Like a river flows surely to the sea,&nbsp;
                            <span style={{ color: '#b5865a' }}>so it goes</span>&nbsp;
                            some things are&nbsp;
                            <span style={{ color: '#b5865a' }}>meant to be.</span>
                        </motion.p>
                        <motion.div
                            className="mx-auto mt-12"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', maxWidth: '80px' }}
                        />
                    </div>

                    {/* ── CINEMATIC MOSAIC STRIP (clickable → lightbox) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-24"
                    >
                        {/* Top row: first 3 images */}
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {displayMosaic.slice(0, 3).map((img, i) => (
                                <div
                                    key={i}
                                    className="overflow-hidden cursor-pointer group relative"
                                    style={{ aspectRatio: '4/3' }}
                                    onClick={() => openLightbox(i)}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.title || `Photo ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.05] grayscale group-hover:grayscale-0"
                                        style={{ filter: 'brightness(0.7)', transition: 'transform 2s ease, filter 0.8s ease, filter 0.8s ease' }}
                                    />
                                    {/* Expand hint on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div style={{ width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom row: images 4 & 5 + film card */}
                        <div className="grid grid-cols-5 gap-2">
                            {displayMosaic.slice(3, 5).map((img, i) => (
                                <div
                                    key={i}
                                    className="col-span-2 overflow-hidden cursor-pointer group relative"
                                    style={{ aspectRatio: '16/7' }}
                                    onClick={() => openLightbox(i + 3)}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.title || `Photo ${i + 4}`}
                                        className="w-full h-full object-cover group-hover:scale-[1.05] grayscale group-hover:grayscale-0"
                                        style={{ filter: 'brightness(0.65)', transition: 'transform 2s ease, filter 0.8s ease' }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div style={{ width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Film counter card */}
                            <div
                                className="col-span-1 flex flex-col items-center justify-center"
                                style={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.08)', fontFamily: 'monospace' }}>35mm</p>
                                <div style={{ height: '1px', width: '30px', backgroundColor: '#b5865a', margin: '10px 0', opacity: 0.5 }} />
                                <p style={{ fontSize: '8px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)' }} className="uppercase">Cinematic</p>
                            </div>
                        </div>

                        {/* Film strip dots */}
                        <div className="flex justify-center gap-3 mt-6">
                            {displayMosaic.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => openLightbox(i)}
                                    className="cursor-pointer"
                                    style={{
                                        width: i === lightbox.index && lightbox.open ? '24px' : '6px',
                                        height: '2px',
                                        backgroundColor: i === lightbox.index && lightbox.open ? '#b5865a' : 'rgba(255,255,255,0.15)',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* ── FULLSCREEN LIGHTBOX ── */}
                    <AnimatePresence>
                        {lightbox.open && (
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
                                <button
                                    onClick={closeLightbox}
                                    className="absolute top-6 right-6 z-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                                    style={{ width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    <X size={16} className="text-white" />
                                </button>

                                {/* Image counter */}
                                <div className="absolute top-6 left-1/2 -translate-x-1/2" style={{ fontSize: '9px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)' }}>
                                    {lightbox.index + 1} / {displayMosaic.length}
                                </div>

                                {/* Prev arrow */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                                    className="absolute left-6 z-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                                    style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.15)' }}
                                >
                                    <ChevronLeft size={20} className="text-white" />
                                </button>

                                {/* Main image */}
                                <motion.div
                                    key={lightbox.index}
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative flex items-center justify-center"
                                    style={{ maxWidth: '90vw', maxHeight: '88vh' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={displayMosaic[lightbox.index]?.src}
                                        alt={displayMosaic[lightbox.index]?.title || ''}
                                        style={{ maxWidth: '88vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
                                    />
                                    {/* Caption */}
                                    {displayMosaic[lightbox.index]?.title && (
                                        <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                                            <p style={{ fontSize: '9px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.35)' }} className="uppercase">
                                                {displayMosaic[lightbox.index].title}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Next arrow */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                                    className="absolute right-6 z-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                                    style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.15)' }}
                                >
                                    <ChevronRight size={20} className="text-white" />
                                </button>

                                {/* Thumbnail strip at bottom */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {displayMosaic.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: i })); }}
                                            className="cursor-pointer overflow-hidden transition-all duration-300"
                                            style={{
                                                width: '48px', height: '32px',
                                                border: i === lightbox.index ? '1px solid #b5865a' : '1px solid rgba(255,255,255,0.1)',
                                                opacity: i === lightbox.index ? 1 : 0.4
                                            }}
                                        >
                                            <img src={img.src} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 3-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16">
                        {stories.map((story, i) => {
                            const couple = story.Couple || story.couple || story.Title || story.title || '';
                            const location = story.Location || story.location || '';
                            const imgSrc = story.Image_URL || story.image || '';
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
                                    {/* Portrait photo — 4/5 ratio */}
                                    <div
                                        className="overflow-hidden relative mb-4"
                                        style={{ aspectRatio: '4/5', backgroundColor: '#111' }}
                                    >
                                        {imgSrc && (
                                            <img
                                                src={imgSrc}
                                                alt={couple}
                                                className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                                            />
                                        )}
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35) 100%)' }}
                                        />
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
                                    </div>

                                    {/* Caption: TRISHA × NIHAAL // HYDERABAD // */}
                                    <div className="pt-1">
                                        <p
                                            style={{ fontSize: '9px', letterSpacing: '0.3em' }}
                                            className="uppercase flex items-baseline flex-wrap gap-x-1"
                                        >
                                            <span style={{ color: '#b5865a' }}>{coupleParts[0]}</span>
                                            {coupleParts[1] && (
                                                <>
                                                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>&nbsp;×&nbsp;</span>
                                                    <span style={{ color: '#b5865a' }}>{coupleParts[1]}</span>
                                                </>
                                            )}
                                            {location && (
                                                <>
                                                    <span style={{ color: 'rgba(255,255,255,0.25)' }}>&nbsp;//&nbsp;</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{location.toUpperCase()}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.25)' }}>&nbsp;//</span>
                                                </>
                                            )}
                                        </p>
                                        <div
                                            className="mt-2 h-px transition-all duration-700 origin-left scale-x-0 group-hover:scale-x-100"
                                            style={{ backgroundColor: '#b5865a', width: '100%', opacity: 0.5 }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* View All Stories button */}
                    {stories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mt-24"
                        >
                            <button
                                onClick={() => onNavigate('stories')}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="group inline-flex items-center gap-4 transition-all duration-300"
                                style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '16px 40px' }}
                            >
                                <span style={{ fontSize: '9px', letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)' }} className="uppercase group-hover:text-white transition-colors">
                                    View All Stories
                                </span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Cinematic Quote */}
            <section className="py-96 px-10 text-center relative overflow-hidden bg-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl md:text-7xl font-display leading-[1.1] italic tracking-tight font-light text-white">
                        "Like a river flows surely <br /> to the sea, so it goes <br /> some things are meant to be."
                    </h2>
                </motion.div>

                {/* Floating background elements */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[-1] opacity-5">
                    <h1 className="text-[30vw] font-display uppercase tracking-tighter opacity-5 text-white">Cinematic</h1>
                </div>
            </section>

            {/* Final Footer - Dark */}
            <footer className="py-32 border-t border-white/5 px-10 bg-black flex flex-col items-center">
                <motion.h2
                    whileHover={{ scale: 1.05 }}
                    className="font-display text-3xl tracking-[0.6em] font-light mb-16 cursor-pointer text-white"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    VANSH GUPTA
                </motion.h2>

                <div className="flex gap-16 text-white/40 mb-24">
                    <a
                        href="https://instagram.com/vansh.gupta08"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Instagram size={20} />
                    </a>
                    <a
                        href="https://wa.me/919329668425"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <MessageCircle size={20} />
                    </a>
                    <a
                        href="mailto:vanshguptasg08@gmail.com"
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Mail size={20} />
                    </a>
                </div>

                <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 text-white">
                    © {new Date().getFullYear()} Vansh Gupta. All Cinematic Rights Reserved.
                </p>
            </footer>
        </motion.main>
    );
};

export default Home;
