import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSheetData } from '../utils/googleSheets';

const FALLBACK_TOP = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoxeG4emCr2z4yJmiwqAXBtKSKyvJF-9ZeaPhxnOKs1loE4yFuyflYDWHs9pOgZhXnqwbAu2BBbouIL5AgiaEtM2WVRmqslCDJTfiN_S25WTqkXqm518NMpkK3uI4_FgOTEPqA35mvtfmKvPg2wB78EmURZH8AoXeTxLG7dJ48rwXnG8-f7QP4a7p4YZX3xfOQPh9M-_MoF9C0cKCS-dcIThk1ATzFh6YsJlcEN_JAVUO-k49TGO2s_2Nyg-r0TCDJBLULoXvXZg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAV2YxMuMiAfj7tXH19I2XHNZpV6Nk0jJfZyjRF73wNoI1m1XOy5g8JGROvnVhjM8d7F2EYVEIsxLyHmVMyTEnQo84XOOxxFCvpTUS21vSQJ8vIeYd4aG7-Y818Id_S_HoP8UdjOOWaG0_DmC8d4C4cBjJMNg6B_txVRAhcbGPi2SioBhsrQWcOzOFRq4QTuC3QWg91e7tHyPAL__qWI_TsyxiflOQa2gJWwDCGd-zmTWSbX_bmW8i0joNkrYSyR_HpL8xWtdbYuQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAE3FAOOY5VPtG2agl70Y6NTPISETtEcDk_QsK2Ro75F8hUa_-EU_07_na8lLsXRZK23-hO7bQIaF4XjksaGZoptee9uAsP3l__iM23Sh2qOy3dh59ve6_tH29XMzBBqxZ7K1F2NB5s4jMqsqXEpy9ik4Ymqm6724MHgXXMp2oNN7flsuvLhdBeJlhXWLLjXlyZjMyK5UnbG7zkqZ5rfDup512L3DtqH5Vji1FvMBpZsQFNNZHduerlgZZexWukB5l66EIDm0fGdg',
];

const FALLBACK_BOTTOM = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRBCwm46pv5bzbOHwrHSaKNIcxm1xSwojCuPeXVBXdNiGVRoxZtKQq2HivEPfCvVNAl30rgJcTo496iUcVKaqNlH-h2q5MotFYQrvRio5w-lKDzNqKrGaB3Uw28RqZs9VZwGamu9Qn7UL4ekLrwOur_FPzVmNFHNmdeWUukN0qX3xt0KPvQaCC8RRhnCzkDMNqZ1p7LYTN3S_dIjVXjtAB4u0o3bhgQNTluXdTS9QlOaLxkIjz136YctRvL25DZkmKwBAWVHPmMQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBAqMWCCorAQsVjh5iu91ckvvYH_yxjARMTge91K5lvKH_TCwgF1xwlng3FEkJ5xGOdjP1RouqfDMsTGweoWWx2GvCjYjfh0_UCzkLYTnkeAMZioQKYATqSELBE1dxAHYcqENaT3GTi8nthzVy7VgpWWTr04XHxG-bFgbXQtB6X50vU35ZjOPJxwIVVp7urKaBNdv56Glb3mXHPrEr_zZpwVSreqUnxp_0SttUUweXvSeQ5ZMKVkG5_AGEE_G2YXwcS8NxcLZng4g',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQUtpeZuSoV1vSsg3eP4R7ypPb5Uq_2_Z2QpzgWoa08Y9089hyrohVwJQoFF_xVofhhAmNKmO0RQkafGqoStweKBmGfKM6idKy9sSpXy3MK8U-qp1Lc6IETVeDLGMXsHFYC4qzDdCmFK_Gh1MxsR5Vua6vP2m9WCh3-hzswh-kP9MYCeGO-nkXXUD31qJkV4h3fbZn9SFuUtl_eN1cX_6xc9nSw5uU-i19PZW8OYS80BYJ2A06OP_lRO6rpjq4K3YTIcrYnTcn8w',
];

const Splash = ({ onEnter }) => {
    const [topImages, setTopImages] = useState(FALLBACK_TOP);
    const [bottomImages, setBottomImages] = useState(FALLBACK_BOTTOM);

    useEffect(() => {
        const loadSplashImages = async () => {
            try {
                const data = await fetchSheetData('Splash');
                if (data && data.length > 0) {
                    const sorted = data
                        .sort((a, b) => (parseInt(a.Order) || 0) - (parseInt(b.Order) || 0));

                    const top = sorted
                        .filter(row => (row.Position || '').toLowerCase() === 'top')
                        .map(row => row.Image_URL)
                        .filter(Boolean);

                    const bottom = sorted
                        .filter(row => (row.Position || '').toLowerCase() === 'bottom')
                        .map(row => row.Image_URL)
                        .filter(Boolean);

                    if (top.length > 0) setTopImages(top);
                    if (bottom.length > 0) setBottomImages(bottom);
                }
            } catch (err) {
                console.warn('Could not load Splash images from Google Sheets, using fallbacks.', err);
            }
        };
        loadSplashImages();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background-dark text-white h-screen flex flex-col overflow-hidden relative z-50"
        >
            {/* Top Mosaic */}
            <section className="flex-1 overflow-hidden relative">
                <div className="mosaic-container animate-scroll-left h-full">
                    {[...topImages, ...topImages].map((url, i) => (
                        <div key={i} className="anamorphic-box border-r border-black/20">
                            <div
                                className="absolute inset-0 bg-cover bg-center scale-110"
                                style={{ backgroundImage: `url('${url}')` }}
                            ></div>
                            <div className="vignette"></div>
                            <div className="video-grain"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Center Hero */}
            <section className="bg-charcoal py-10 px-6 flex flex-col items-center justify-center border-y border-white/10 z-20 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center"
                >
                    <h1 className="font-display text-white tracking-[0.35em] text-3xl md:text-5xl font-light uppercase leading-tight mb-3">
                        VANSH GUPTA
                    </h1>
                    <p className="text-white/60 text-[11px] tracking-[0.6em] uppercase font-sans mb-10">
                        Cinematographer / Live Broadcast
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={onEnter}
                            className="group relative flex min-w-[180px] items-center justify-center overflow-hidden border border-white/20 h-14 px-10 bg-transparent hover:bg-white transition-all duration-700 ease-in-out"
                        >
                            <span className="text-[11px] font-medium tracking-[0.5em] uppercase z-10 group-hover:text-black transition-colors duration-500">ENTER</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Bottom Mosaic */}
            <section className="flex-1 overflow-hidden relative">
                <div className="mosaic-container animate-scroll-left h-full">
                    {[...bottomImages, ...bottomImages].map((url, i) => (
                        <div key={i} className="anamorphic-box border-r border-black/20">
                            <div
                                className="absolute inset-0 bg-cover bg-center scale-110"
                                style={{ backgroundImage: `url('${url}')` }}
                            ></div>
                            <div className="vignette"></div>
                            <div className="video-grain"></div>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
};

export default Splash;
