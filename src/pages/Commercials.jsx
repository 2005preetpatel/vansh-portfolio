import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Instagram, Mail, MessageCircle } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';

const Commercials = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('Commercials');
            setProjects(data.sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0)));
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
            className="bg-[#141414] text-white min-h-screen pt-32 px-10 relative overflow-hidden"
        >
            <motion.div
                className={`custom-cursor ${isHovering ? 'active' : ''}`}
                animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
            />
            <div className="film-grain" />

            <nav className="fixed top-0 w-full z-50 px-10 py-10 flex justify-between items-center bg-black/40 backdrop-blur-md">
                <button onClick={onBack} className="flex items-center gap-4 group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] tracking-[0.4em] uppercase font-medium">Back</span>
                </button>
                <h2 className="font-display text-xl tracking-[0.4em] font-light italic">COMMERCIALS</h2>
                <span className="text-[8px] tracking-[0.4em] uppercase opacity-40">Advertising / Branded</span>
            </nav>

            <div className="max-w-7xl mx-auto space-y-32">
                {projects.map((project, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-8 group"
                    >
                        <div className="relative aspect-[21/9] overflow-hidden border border-white/5" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <img src={project.Thumbnail_URL || project.url} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-[2s]" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-20 h-20 rounded-full border border-white/50 flex items-center justify-center"><Play size={24} /></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[9px] tracking-[0.5em] uppercase text-white/30">{project.Brand || project.brand}</span>
                                <h3 className="text-4xl font-display uppercase tracking-[0.2em] italic">{project.Title || project.title}</h3>
                            </div>
                            <span className="text-[8px] tracking-[1em] text-white/20">CASE STUDY</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <footer className="mt-64 py-20 flex flex-col items-center border-t border-white/5">
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
                        href="https://wa.me/918982911149"
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
                <p className="text-[7px] tracking-[0.3em] uppercase opacity-20">VANSH GUPTA // COMMERCIAL DIVISION</p>
            </footer>
        </motion.div>
    );
};

export default Commercials;
