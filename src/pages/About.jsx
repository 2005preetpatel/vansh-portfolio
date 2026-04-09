import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, Mail, MessageCircle } from 'lucide-react';
import { fetchSheetData } from '../utils/googleSheets';

const About = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSheetData('About');
            if (data && data.length > 0) {
                setAboutData(data[0]); // Take the first row for bio
            }
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
                <h2 className="font-display text-xl tracking-[0.4em] font-light">ABOUT</h2>
                <span className="text-[8px] tracking-[0.4em] uppercase opacity-40">Philosophy / Vision</span>
            </nav>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center min-h-[70vh]">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5 }}>
                    <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none italic mb-12">
                        {aboutData?.Full_Name || "VANSH GUPTA"}
                    </h2>
                    <p className="text-xl text-white/40 leading-relaxed font-light mb-12">
                        {aboutData?.Bio_Text || "Cinematographer and storyteller based in India. specialized in creating fictional narratives out of real moments. I believe every frame should evoke an emotion, and every sequence should tell a truth that words cannot reach."}
                    </p>
                    <div className="flex gap-12">
                        <div className="text-center">
                            <span className="block text-4xl font-display">{aboutData?.Films_Count || "80+"}</span>
                            <span className="text-[8px] tracking-[0.3em] uppercase text-white/20">Shoots</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-display">{aboutData?.Years_Exp || "3+"}</span>
                            <span className="text-[8px] tracking-[0.3em] uppercase text-white/20">Years</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/5">
                    <img src={aboutData?.Image_URL || "https://lh3.googleusercontent.com/aida-public/AB6AXuVXfyJ5gUeRUZ4oyrN2BykBJaMuk55jOXxHC6afYL2vjWY3lKuVrx5u-SOT5em4AhIzdXTuW_PsSsC5LauKksn1KwA9QX2CoJ2PqasLFMmEBFFpHP2dWQyJRo0ddYQr7XFHirsABxl3t2bSu8O-cnR_cQq6clRK8MBffPdBk3yCOTmlannBdJnUcmTPHp_lue6sxpxQJ-M8EHKTRMDRehojtkN6OzUYDD-xf7UWj2fEqmR3WRngVjcL-A"} className="w-full h-full object-cover grayscale opacity-50" />
                </motion.div>
            </div>

            <footer className="mt-32 py-20 border-t border-white/5 flex flex-col items-center">
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
                <p className="text-[7px] tracking-[0.3em] uppercase opacity-20">VANSH GUPTA // PHILOSOPHY</p>
            </footer>
        </motion.div>
    );
};

export default About;
