import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, MessageCircle, Play, X, ChevronLeft, ChevronRight, ExternalLink, Sun, Moon } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';
import StoryDetail from './StoryDetail';

const Home = ({ onNavigate, isDarkMode, toggleTheme }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [stories, setStories] = useState([]);

    const [selectedStory, setSelectedStory] = useState(null);
    const [mosaicImages, setMosaicImages] = useState([]);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const [showReelMode, setShowReelMode] = useState(false);
    const [playAboutReel, setPlayAboutReel] = useState(false);
    const [activeCommIndex, setActiveCommIndex] = useState(0);
    const [selectedCommercial, setSelectedCommercial] = useState(null);

    const commercialItemsData = [
        { title: "EVENTS", category: "Weddings & Celebrations", desc: "Capturing unforgettable moments\nand grand celebrations", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", video: "/IMG_6404.MP4", link: "/stories" },
        { title: "CAR BRANDS", category: "Automotive Commercial", desc: "High-octane automotive reels", img: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80", video: "/IMG_6404.MP4", link: "/stories" },
        { title: "INTERIORS", category: "Real Estate & Architecture", desc: "Architectural & spatial aesthetics", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", video: "/IMG_6404.MP4", link: "/stories" },
        { title: "LUXURY RESORTS", category: "Hospitality content", desc: "Immersive hospitality experiences", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", video: "/IMG_6404.MP4", link: "/stories" },
        { title: "FASHION", category: "Apparel campaigns", desc: "Editorial lifestyle campaigns", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", video: "/IMG_6404.MP4", link: "/stories" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!selectedCommercial) {
                setActiveCommIndex((prev) => (prev + 1) % commercialItemsData.length);
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [selectedCommercial, commercialItemsData.length]);
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
            className="bg-[#141414] text-white min-h-screen selection:bg-white selection:text-black relative overflow-hidden"
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
                <div className="hidden md:flex gap-10 lg:gap-14 text-xl md:text-2xl font-script uppercase tracking-widest text-white/80 items-center transition-colors">
                    <button
                        onClick={() => onNavigate('galleries')}
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Galleries
                    </button>
                    <button
                        onClick={() => onNavigate('commercials')}
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Commercials
                    </button>
                    <button
                        onClick={() => onNavigate('stories')}
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Stories
                    </button>
                    <button
                        onClick={() => onNavigate('about')}
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        About
                    </button>
                    <button
                        onClick={() => onNavigate('enquire')}
                        className="hover:text-white transition-colors"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Enquire
                    </button>
                    {/* Theme Toggle in Navbar */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center p-2 text-white hover:text-white/70 transition-all duration-300 group ml-2 outline-none focus:outline-none"
                        title="Toggle Theme"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <span className="sr-only">Toggle Theme</span>
                        {isDarkMode ? (
                            <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500" /> 
                        ) : (
                            <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: y1, scale }}
                    className="absolute inset-0 z-0 bg-[#141414]"
                >
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3FAOOY5VPtG2agl70Y6NTPISETtEcDk_QsK2Ro75F8hUa_-EU_07_na8lLsXRZK23-hO7bQIaF4XjksaGZoptee9uAsP3l__iM23Sh2qOy3dh59ve6_tH29XMzBBqxZ7K1F2NB5s4jMqsqXEpy9ik4Ymqm6724MHgXXMp2oNN7flsuvLhdBeJlhXWLLjXlyZjMyK5UnbG7zkqZ5rfDup512L3DtqH5Vji1FvMBpZsQFNNZHduerlgZZexWukB5l66EIDm0fGdg"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                </motion.div>

                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center px-6"
                >
                    <h1 className="font-display font-light leading-none tracking-tight text-white"
                        style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.01em' }}
                    >
                        You Feel. I Focus,
                    </h1>
                    <h1 className="font-display font-semibold leading-none tracking-tight"
                        style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.01em', color: '#4ade80' }}
                    >
                        We Frame
                    </h1>
                    <div className="w-16 h-px mx-auto mt-8 mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <p className="text-[10px] tracking-[0.55em] uppercase text-white/40 font-medium">
                        Director of Photography&nbsp;/&nbsp;Cinematic Storytelling
                    </p>
                </motion.div>


            </header>

            {/* About Section - Dark */}
            <section className="py-64 px-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
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
                        {playAboutReel ? (
                            <video 
                                className="w-full h-full object-contain bg-black"
                                autoPlay 
                                controls 
                                playsInline
                                src="/IMG_6404.MP4"
                            />
                        ) : (
                            <>
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3FAOOY5VPtG2agl70Y6NTPISETtEcDk_QsK2Ro75F8hUa_-EU_07_na8lLsXRZK23-hO7bQIaF4XjksaGZoptee9uAsP3l__iM23Sh2qOy3dh59ve6_tH29XMzBBqxZ7K1F2NB5s4jMqsqXEpy9ik4Ymqm6724MHgXXMp2oNN7flsuvLhdBeJlhXWLLjXlyZjMyK5UnbG7zkqZ5rfDup512L3DtqH5Vji1FvMBpZsQFNNZHduerlgZZexWukB5l66EIDm0fGdg"
                                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]"
                                    alt="Atmospheric"
                                />
                                <div 
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 cursor-pointer"
                                    onClick={() => setPlayAboutReel(true)}
                                >
                                    <div
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                        className="w-24 h-24 rounded-full border border-white/50 flex items-center justify-center text-white bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm"
                                    >
                                        <Play size={32} className="ml-2" />
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── REAL LOVE STORIES — 3-Column Magazine Grid ── */}
            <section className="bg-[#141414] pt-12 pb-32 px-6 md:px-10 border-t border-white/5">
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


                        {/* Commercial Capabilities Carousel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="w-full mx-auto mb-20 px-4 mt-8"
                        >
                            <div className="relative w-full flex justify-center items-center h-[450px] md:h-[550px] overflow-hidden perspective-[1200px]">
                                {commercialItemsData.map((item, idx) => {
                                    const offset = (idx - activeCommIndex + commercialItemsData.length) % commercialItemsData.length;
                                    let normalizedOffset = offset;
                                    if (normalizedOffset > Math.floor(commercialItemsData.length / 2)) {
                                        normalizedOffset -= commercialItemsData.length;
                                    }

                                    const isActive = normalizedOffset === 0;
                                    const translateOffset = normalizedOffset * 65; // percentage horizontal shift
                                    const scale = isActive ? 1 : Math.max(0.75, 1 - Math.abs(normalizedOffset) * 0.18);
                                    const zIndex = 10 - Math.abs(normalizedOffset);
                                    const opacity = isActive ? 1 : Math.max(0, 0.5 - Math.abs(normalizedOffset) * 0.25);
                                    const filter = isActive ? "blur(0px)" : "blur(4px)";
                                    
                                    return (
                                        <motion.div
                                            key={idx}
                                            onClick={() => {
                                                if (isActive) {
                                                    setSelectedCommercial(item);
                                                } else {
                                                    setActiveCommIndex(idx);
                                                }
                                            }}
                                            className="absolute w-[280px] md:w-[340px] h-[400px] md:h-[480px] rounded-[2rem] overflow-hidden cursor-pointer"
                                            animate={{
                                                x: `${translateOffset}%`,
                                                scale: scale,
                                                opacity: opacity,
                                                zIndex: zIndex,
                                                filter: filter
                                            }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            style={{
                                                backgroundColor: '#111'
                                            }}
                                        >
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                            
                                            {/* Specialized dark overlay to match Image 2 */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent mix-blend-multiply opacity-80" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                            
                                            <div className={`absolute bottom-8 left-0 w-full text-center px-6 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                                <h3 className="text-2xl md:text-[28px] font-sans font-black text-white/80 whitespace-pre-line leading-[1.1] mb-3 uppercase tracking-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[13px] text-white/40 whitespace-pre-line leading-relaxed font-sans px-2">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Custom Indicator */}
                            <div className="flex justify-center mt-6">
                                <div className="flex items-center gap-4 bg-[#14161a]/80 backdrop-blur-[8px] px-5 py-2.5 rounded-full border border-white/5 shadow-2xl">
                                    <div className="flex gap-2.5 items-center">
                                        {commercialItemsData.map((_, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setActiveCommIndex(i)}
                                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === activeCommIndex ? 'w-6 bg-white/90' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="w-[1px] h-3 bg-white/10 mx-1" />
                                    <span className="text-white/60 text-[11px] font-mono tracking-widest pl-1 opacity-80">
                                        {String(activeCommIndex + 1).padStart(2, '0')} / {String(commercialItemsData.length).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display italic text-white mt-24 md:mt-32 pt-8"
                            style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: '2rem' }}
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
                            Crafting visual poetry through the lens.&nbsp;
                            <span style={{ color: '#b5865a' }}>Translating raw life</span>&nbsp;
                            into cinematic masterpieces, from intimate weddings to&nbsp;
                            <span style={{ color: '#b5865a' }}>sweeping brand stories.</span>
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

            {/* Aesthetic Transition Section - Brands and Commercial */}
            <section className="py-24 bg-[#141414] relative overflow-hidden">
                {/* Parallax Background */}
                <div
                    className="absolute inset-0 bg-cover bg-fixed bg-center opacity-20 grayscale mix-blend-luminosity"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1600&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-[#141414]/80 to-[#141414]" />

                <div className="relative z-10 max-w-7xl mx-auto px-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] w-12 bg-[#b5865a]" />
                                <p className="text-[9px] tracking-[0.5em] uppercase text-[#b5865a]">Beyond The Altar</p>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-display italic text-white leading-tight mb-8 tracking-tight">
                                Elevating Brand narratives through cinematic vision
                            </h2>
                            <p className="text-white/40 text-[10px] tracking-widest uppercase leading-[2.5] max-w-lg">
                                Masterful visual storytelling applied to high-end automotive, luxury real estate, fashion editorials, and immersive commercial campaigns. Providing world-class aesthetics across industries.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex-1 w-full"
                        >
                            {/* Cinematic Showreel Spotlight */}
                            <div
                                onClick={() => setShowReelMode(true)}
                                className="relative w-full aspect-square md:aspect-[4/3] group cursor-pointer overflow-hidden border border-white/10"
                            >
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[2s] ease-out" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80')" }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-transparent transition-all duration-700" />

                                {/* Spinning Text Badge */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center backdrop-blur-md bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-700 ease-out z-10">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center pl-1 group-hover:bg-[#b5865a] transition-colors duration-500 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    {/* Curved text ring */}
                                    <div className="absolute inset-0 animate-[spin_12s_linear_infinite] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700" style={{ width: '180%', height: '180%', top: '-40%', left: '-40%' }}>
                                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                            <path id="circlePath2" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                                            <text className="text-[6.5px] uppercase tracking-[0.3em] font-medium" fill="white">
                                                <textPath href="#circlePath2" startOffset="0%">
                                                    PLAY COMMERCIAL REEL ✦ WATCH THE VISION ✦
                                                </textPath>
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 z-10">
                                    <p className="text-[9px] tracking-[0.4em] uppercase text-[#b5865a] mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">Featured Work</p>
                                    <h3 className="text-3xl md:text-4xl font-display italic text-white tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">The Brand Cut</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Infinite Marquee */}
                    <div className="w-full overflow-hidden border-t border-white/5 pt-12 relative flex">
                        {/* We use double elements for infinite scroll illusion */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex whitespace-nowrap animate-scroll-left">
                                {[...Array(2)].map((_, j) => (
                                    <div key={j} className="flex items-center text-7xl font-display text-white/5 tracking-tighter">
                                        <span className="px-8 italic hover:text-white/20 transition-colors duration-500 cursor-pointer">COMMERCIAL</span>
                                        <span className="text-[#b5865a]/20 text-3xl">✦</span>
                                        <span className="px-8 italic hover:text-white/20 transition-colors duration-500 cursor-pointer">EDITORIAL</span>
                                        <span className="text-[#b5865a]/20 text-3xl">✦</span>
                                        <span className="px-8 italic hover:text-white/20 transition-colors duration-500 cursor-pointer">CINEMATIC</span>
                                        <span className="text-[#b5865a]/20 text-3xl">✦</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cinematic Quote */}
            <section className="py-24 md:py-32 px-10 text-center relative overflow-hidden bg-[#141414]">
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
            <footer className="py-32 border-t border-white/5 px-10 bg-[#141414] flex flex-col items-center">
                <motion.h2
                    initial={{ letterSpacing: "1em", opacity: 0, y: 20 }}
                    whileInView={{ letterSpacing: "0.15em", opacity: 1, y: 0 }}
                    transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: false, margin: "-50px" }}
                    whileHover={{ letterSpacing: "0.25em", scale: 1.05 }}
                    className="font-display text-4xl md:text-5xl font-light mb-16 cursor-pointer text-white uppercase text-center w-full"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    Vansh Gupta
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
            {/* Commercial Project Modal */}
            <AnimatePresence>
                {selectedCommercial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedCommercial(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#1c1c1f] w-full max-w-5xl h-[85vh] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative outline outline-1 outline-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedCommercial(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                            >
                                <X size={18} strokeWidth={2} />
                            </button>

                            {/* Left Side: Media */}
                            <div className="w-full md:w-1/2 h-2/5 md:h-full relative bg-black shrink-0">
                                <img src={selectedCommercial.img} alt={selectedCommercial.title} className="w-full h-full object-cover opacity-90" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1c1c1f] hidden md:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent md:hidden" />
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-[100%] md:w-1/2 p-6 md:p-12 flex flex-col justify-between overflow-y-auto">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-white rounded-full text-black text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-4 md:mb-6">
                                        {selectedCommercial.category}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-sans font-black text-white mb-3 md:mb-4 leading-tight tracking-tight uppercase">
                                        {selectedCommercial.title}
                                    </h2>
                                    <p className="text-sm md:text-base text-white/50 leading-relaxed font-sans max-w-sm mb-6 md:mb-8">
                                        {selectedCommercial.desc}
                                        <br />
                                        <br />
                                        Delivering high-end cinematic content that elevates brand narratives.
                                    </p>

                                    <button 
                                        className="w-full md:w-auto bg-white text-black font-semibold text-sm px-8 py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                                        onClick={() => {
                                            setSelectedCommercial(null);
                                            window.scrollTo(0, 0);
                                            if (onNavigate) onNavigate('commercials');
                                        }}
                                    >
                                        View Project <ExternalLink size={18} strokeWidth={2} />
                                    </button>
                                </div>

                                {/* More Projects Section */}
                                <div className="mt-8 md:mt-0">
                                    <h4 className="text-[10px] tracking-widest text-white/40 uppercase mb-3 md:mb-4 font-bold">More Projects</h4>
                                    <div className="flex gap-3 md:gap-4">
                                        {commercialItemsData.filter(i => i.title !== selectedCommercial.title).slice(0, 3).map((proj, i) => (
                                            <div 
                                                key={i} 
                                                className="w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden cursor-pointer relative group"
                                                onClick={() => setSelectedCommercial(proj)}
                                            >
                                                <img src={proj.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Video Reel Modal */}
            <AnimatePresence>
                {showReelMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowReelMode(false)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 z-[10000] text-white/50 hover:text-white transition-colors"
                        >
                            <X size={40} strokeWidth={1} />
                        </button>

                        <div className="w-full max-w-6xl aspect-video bg-[#050505] relative border border-white/10 shadow-2xl rounded-sm overflow-hidden flex items-center justify-center">

                            <video
                                className="w-full h-full object-contain bg-black"
                                autoPlay
                                muted
                                controls
                                playsInline
                                src="/IMG_6404.MP4"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
};

export default Home;
