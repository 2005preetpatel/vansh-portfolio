import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

const Enquire = ({ onBack }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

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
            className="bg-black text-white min-h-screen pt-32 px-10 relative overflow-hidden flex flex-col items-center"
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
                <h2 className="font-display text-xl tracking-[0.4em] font-light">ENQUIRE</h2>
                <span className="text-[8px] tracking-[0.4em] uppercase opacity-40">Get in touch</span>
            </nav>

            <div className="max-w-2xl w-full mt-20 text-center">
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-display uppercase italic tracking-tighter mb-20">
                    Let's create <br /> fiction together.
                </motion.h2>

                <form className="space-y-12 text-left">
                    <div className="space-y-4">
                        <label className="text-[8px] tracking-[0.5em] uppercase text-white/30">Your Name</label>
                        <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white transition-colors outline-none font-light tracking-widest" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[8px] tracking-[0.5em] uppercase text-white/30">Email Address</label>
                        <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white transition-colors outline-none font-light tracking-widest" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[8px] tracking-[0.5em] uppercase text-white/30">Tell us your story</label>
                        <textarea rows="4" className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white transition-colors outline-none font-light tracking-widest resize-none" />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-6 bg-white text-black text-[10px] tracking-[0.8em] font-bold uppercase transition-all"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        Submit Enquiry
                    </motion.button>
                </form>
            </div>

            <footer className="mt-auto py-20 opacity-20 text-[7px] tracking-[0.3em] uppercase">
                Shoot us an email: hello@vanshgupta.com
            </footer>
        </motion.div >
    );
};

export default Enquire;
