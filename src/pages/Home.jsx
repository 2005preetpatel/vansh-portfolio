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

    const [loadingPerc, setLoadingPerc] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            current += Math.floor(Math.random() * 15) + 5;
            if (current >= 100) {
                current = 100;
                setLoadingPerc(current);
                clearInterval(interval);
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            } else {
                setLoadingPerc(current);
            }
        }, 120);
        return () => clearInterval(interval);
    }, []);

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

    const targetRef = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const xHorizontal = useTransform(scrollYProgress, [0, 1], ["10%", "-80%"]);

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
            {/* Aura Preloader */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex items-center justify-between px-10 md:px-20"
                    >
                        <h2 className="text-white text-5xl md:text-8xl font-sans font-semibold tracking-tighter uppercase leading-[0.9]">
                            VANSH <br/>GUPTA
                        </h2>
                        <span className="text-white text-xl md:text-3xl font-mono">
                            {loadingPerc}%
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

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
            <nav className="fixed top-0 w-full z-50 px-10 py-5 flex justify-between items-center bg-black/60 backdrop-blur-md transition-all duration-500">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-sans font-medium text-xs tracking-widest cursor-pointer text-white"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => onNavigate('splash')}
                >
                    VANSH GUPTA
                </motion.h1>
                <div className="hidden md:flex gap-6 lg:gap-8 text-xs md:text-sm font-script uppercase tracking-widest text-white/80 items-center transition-colors">
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

            {/* Hero Section - Aura Brand Portfolio Structure (Dark Theme) */}
            <header className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-center px-6 md:px-20 lg:px-32">
                
                {/* Staggered Large-Scale Headings - Aura Style */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="relative z-20 max-w-5xl md:-translate-y-8 pl-4 md:pl-0"
                >
                    <div className="overflow-hidden pb-1">
                        <motion.h1 
                            variants={{ hidden: { opacity: 0, y: "120%" }, visible: { opacity: 1, y: 0 } }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-sans font-semibold text-white text-[12vw] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter uppercase"
                        >
                            CINEMATOGRAPHY
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden pb-1 md:pl-32">
                        <motion.h1 
                            variants={{ hidden: { opacity: 0, y: "120%" }, visible: { opacity: 1, y: 0 } }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-sans font-semibold text-white text-[12vw] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter uppercase text-white/90"
                        >
                            PORTFOLIO
                        </motion.h1>
                    </div>
                </motion.div>

                {/* Right anchored portrait video / image mimicking Aura */}
                <motion.div 
                    initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-10 right-10 w-[50%] md:w-[35%] h-[50%] md:h-[60%] z-10 hidden md:block"
                >
                    <video 
                        src="/aston martin reel 1.0_2_apo8_prob4.MP4" 
                        autoPlay 
                        loop 
                        muted
                        playsInline
                        className="w-full h-full object-cover shadow-2xl brightness-90 grayscale-[20%]"
                    />
                </motion.div>
                
                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-12 left-6 md:left-20 flex items-center gap-4 z-20"
                >
                    <div className="w-12 h-[1px] bg-white/30" />
                    <span className="text-[10px] tracking-widest text-white/50 uppercase font-mono">Scroll to explore</span>
                </motion.div>
            </header>

            {/* Horizontal Scroll "Selected Works" Gallery */}
            <section ref={targetRef} className="relative h-[300vh] bg-[#0a0a0a]">
                <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-20">
                    <div className="absolute top-16 left-6 md:left-20 z-10 flex items-center gap-4">
                        <div className="h-[1px] w-8 bg-[#b5865a]" />
                        <span className="text-[10px] tracking-widest text-[#b5865a] uppercase font-mono">Selected Works</span>
                    </div>
                    
                    <motion.div style={{ x: xHorizontal }} className="flex gap-8 md:gap-20 px-6 md:px-20 items-center">
                        {commercialItemsData.map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    setSelectedCommercial(item);
                                }}
                                className="w-[85vw] md:w-[65vw] h-[60vh] md:h-[75vh] shrink-0 relative rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer"
                            >
                                <img 
                                    src={item.img} 
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03] grayscale group-hover:grayscale-0 brightness-[0.6] group-hover:brightness-90" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/10 to-transparent pointer-events-none opacity-80" />
                                
                                <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 opacity-70 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0">
                                    <p className="text-[10px] tracking-widest uppercase text-white/80 font-sans font-medium mb-3">{item.category}</p>
                                    <h3 className="font-sans font-semibold uppercase tracking-tighter text-white text-4xl md:text-[4rem] leading-[0.9] mb-4">{item.title}</h3>
                                    <p className="text-white/60 text-xs md:text-sm max-w-xs font-light leading-relaxed hidden md:block">
                                        {item.desc}
                                    </p>
                                </div>
                                
                                {/* Hover Play UI */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[1s] pointer-events-none">
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-sm bg-black/20 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-[1s] ease-out">
                                        <Play size={18} fill="white" className="text-white ml-1 mb-1" />
                                        <span className="text-[8px] tracking-[0.3em] uppercase text-white/80 font-mono">Play</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Studio Capabilities Split-Screen */}
            <section className="py-32 md:py-48 px-6 md:px-20 lg:px-32 bg-[#0a0a0a] border-t border-white/5 relative flex flex-col md:flex-row gap-16 md:gap-32 min-h-screen items-center">
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 40%)' }}></div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <p className="text-[10px] tracking-widest text-[#b5865a] uppercase font-sans font-medium mb-10 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-[#b5865a]" /> Our Studio
                        </p>
                        <h2 className="font-sans font-semibold text-white text-[12vw] md:text-[7rem] leading-[0.9] tracking-tighter uppercase mb-12">
                            ELEVATING <br className="hidden md:block"/><span className="text-white/50">BRAND <br className="hidden md:block"/>NARRATIVES</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                    >
                        <p className="text-sm md:text-lg text-white/50 leading-relaxed font-light mb-12 max-w-lg">
                            We are creating fiction out of reality. Masterful visual storytelling applied to high-end automotive, luxury real estate, fashion editorials, and immersive commercial campaigns. Providing world-class cinematic aesthetics across industries.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-10 mb-16 max-w-md">
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white text-lg font-sans font-medium uppercase tracking-tight mb-2">Directing</h4>
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-sans">Cinematography</p>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white text-lg font-sans font-medium uppercase tracking-tight mb-2">Editorial</h4>
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-sans">Post-Production</p>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white text-lg font-sans font-medium uppercase tracking-tight mb-2">Coloring</h4>
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-sans">Color Grading</p>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white text-lg font-sans font-medium uppercase tracking-tight mb-2">Strategy</h4>
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-sans">Creative Direction</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => onNavigate('about')}
                            className="group relative inline-flex items-center gap-4 border-b border-[#b5865a] pb-2 hover:border-white transition-colors w-max"
                        >
                            <span className="text-xs font-sans font-bold uppercase text-[#b5865a] group-hover:text-white transition-colors">Discover Studio</span>
                            <ChevronRight size={16} className="text-[#b5865a] group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Aura Style Final Footer */}
            <section className="bg-[#0a0a0a] pt-32 pb-10 px-6 md:px-20 border-t border-white/5 relative flex flex-col justify-end min-h-[80vh] md:min-h-[100vh]">
                <div className="absolute top-16 left-6 md:left-20 flex gap-4 text-white/50 text-[10px] uppercase font-mono tracking-widest">
                    <span>(05)</span>
                    <span>Get in Touch</span>
                </div>
                
                <div className="w-full text-center md:text-left flex flex-col items-start mb-16 gap-6 md:gap-10 mt-auto">
                    <h1 
                        className="font-sans font-semibold text-white text-[16vw] md:text-[18vw] leading-[0.8] tracking-custom-tight uppercase m-0 hover:text-[#b5865a] transition-colors cursor-pointer w-full text-center md:text-left" 
                        onClick={() => onNavigate('enquire')}
                        style={{ letterSpacing: "-0.05em" }}
                    >
                        CONTACT
                    </h1>
                    
                    <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:mt-10 mb-4 items-center md:items-end gap-10 md:gap-0">
                        <div className="flex flex-col gap-2 md:gap-4 text-center md:text-left">
                            <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-2">Location</h4>
                            <p className="text-white text-base md:text-xl font-medium tracking-tight">Raipur, CG, India</p>
                            <p className="text-white/60 text-sm md:text-base font-light">Available Worldwide</p>
                        </div>

                        <div className="flex flex-col gap-2 md:gap-4 text-center md:text-right">
                            <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-2">Direct</h4>
                            <a href="mailto:vanshguptasg08@gmail.com" className="text-white text-base md:text-xl font-medium tracking-tight hover:text-[#b5865a] transition-colors relative group w-max mx-auto md:ml-auto md:mr-0 inline-block overflow-hidden">
                                <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-full inline-block">vanshguptasg08@gmail.com</span>
                                <span className="absolute left-0 top-full group-hover:top-0 transition-all duration-500 text-[#b5865a] inline-block z-10">vanshguptasg08@gmail.com</span>
                            </a>
                            <a href="https://wa.me/919329668425" className="text-white text-base md:text-xl font-medium tracking-tight hover:text-[#b5865a] transition-colors relative group w-max mx-auto md:ml-auto md:mr-0 inline-block overflow-hidden">
                                <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-full inline-block">+91 93296 68425</span>
                                <span className="absolute left-0 top-full group-hover:top-0 transition-all duration-500 text-[#b5865a] inline-block z-10">+91 93296 68425</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row justify-between items-center text-white/40 text-[10px] tracking-widest uppercase font-mono border-t border-white/10 pt-8 mt-4 gap-6">
                    <p>© {new Date().getFullYear()} Vansh Gupta.</p>
                    <div className="flex gap-8">
                        <a href="https://instagram.com/vansh.gupta08" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Vimeo</a>
                    </div>
                    <p>Site by Prototype</p>
                </div>
            </section>
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
