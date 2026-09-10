import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

type SharedProps = {
    appSettings?: {
        app_name: string;
        logo_url: string | null;
        email: string | null;
        phone_number: string | null;
        instagram_url: string | null;
        youtube_url: string | null;
        spotify_url: string | null;
        deezer_url: string | null;
        apple_music_url: string | null;
        latest_video_url: string | null;
    };
    aboutSection?: {
        image_url: string | null;
        title: string;
        description: string | null;
        active: boolean;
    };
    heroSlides?: {
        id: number;
        image_url: string | null;
        title: string;
        description: string | null;
    }[];
    personel?: {
        id: number;
        nama: string;
        posisi: string;
        image_url: string | null;
    }[];
    newAlbum?: {
        title: string;
        release_date: string | null;
        active: boolean;
    };
    discography?: {
        id: number;
        title: string;
        year: string;
        cover_url: string | null;
    }[];
    originals?: {
        id: number;
        judul: string;
        image_url: string | null;
        link_spotify: string | null;
    }[];
};

// Default discography data
const DEFAULT_DISCOGRAPHY = [
    { id: 1, title: 'Merayakan Luka', year: '2025', cover_url: '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp' },
    { id: 2, title: 'Homesick Sunday', year: '2024', cover_url: '/assets/framer/Zipm3eed7mvbKMhS74gTW8yWh4.webp' },
    { id: 3, title: 'The Crowd', year: '2022', cover_url: '/assets/framer/D5zSmAFTNkGM4riElgUuURBstk.webp' },
    { id: 4, title: 'Umbrella', year: '2019', cover_url: '/assets/framer/v1JsDMaOv9TyLjajKpcNumqVk.webp' },
    { id: 5, title: 'Fire', year: '2018', cover_url: '/assets/framer/t0dsxWgFf9jNFhSZaF7LXLt2Neg.webp' },
    { id: 6, title: 'Fractal', year: '2016', cover_url: '/assets/framer/7DHv07pRhhRIpoUj30Xl0kK4.webp' },
];

const DEFAULT_PERSONEL = [
    { id: 1, nama: 'Member 1', posisi: 'Vocalist', image_url: 'https://i.pravatar.cc/300?img=21' },
    { id: 2, nama: 'Member 2', posisi: 'Guitarist', image_url: 'https://i.pravatar.cc/300?img=22' },
    { id: 3, nama: 'Member 3', posisi: 'Bassist', image_url: 'https://i.pravatar.cc/300?img=23' },
    { id: 4, nama: 'Member 4', posisi: 'Drummer', image_url: 'https://i.pravatar.cc/300?img=24' },
];

function extractYoutubeId(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
}

function useInView(threshold = 0.2) {
    const ref = useRef<HTMLElement | HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export default function Landing() {
    const { appSettings, aboutSection, heroSlides, personel, newAlbum, discography, originals } = usePage<SharedProps>().props;

    const heroBgImage = heroSlides?.[0]?.image_url ?? '/assets/framer/NPeWnGtJldx73btqyb5p3F96g3A.jpg';
    const memberList = personel && personel.length > 0 ? personel : DEFAULT_PERSONEL;
    const discList = originals && originals.length > 0
        ? originals.map((item) => ({
            id: item.id,
            title: item.judul,
            year: '',
            cover_url: item.image_url || '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp',
            link_spotify: item.link_spotify,
          }))
        : discography && discography.length > 0
            ? discography.map((d) => ({ ...d, link_spotify: null as string | null }))
            : DEFAULT_DISCOGRAPHY.map((d) => ({ ...d, link_spotify: null as string | null }));

    const latestOriginal = originals && originals.length > 0 ? originals[0] : null;

    const bandName = appSettings?.app_name || 'Homesick Sunday';

    // Responsive window width state
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;

    // Responsive items per view
    const discItemsPerView = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
    const [discIndex, setDiscIndex] = useState(0);
    const maxIndex = Math.max(0, discList.length - discItemsPerView);

    const personelItemsPerView = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 4;
    const [personelIndex, setPersonelIndex] = useState(0);
    const personelMaxIndex = Math.max(0, memberList.length - personelItemsPerView);

    // Touch swipe state for sliders
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Scroll-triggered animations
    const { ref: heroRef, inView: heroInView } = useInView(0.1);
    const { ref: aboutRef, inView: aboutInView } = useInView(0.15);
    const { ref: albumRef, inView: albumInView } = useInView(0.2);
    const { ref: personelRef, inView: personelInView } = useInView(0.15);
    const { ref: discRef, inView: discInView } = useInView(0.15);

    // Marquee animation for new album ticker
    const [navScrolled, setNavScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setNavScrolled(window.scrollY > 80);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <Head>
                <title>{bandName}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    html { scroll-behavior: smooth; }
                    body { background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                    :root { --red: #ff2b4b; --yellow: rgb(240, 207, 42); --black: #000; --white: #fff; }
                    
                    /* Scrollbar */
                    ::-webkit-scrollbar { width: 3px; }
                    ::-webkit-scrollbar-track { background: #000; }
                    ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

                    /* Bebas Neue display font */
                    .bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }

                    /* Hide header on mobile */
                    @media (max-width: 768px) {
                        .main-header { display: none !important; }
                    }

                    /* Nav */
                    .nav-link {
                        font-family: 'Bebas Neue', sans-serif;
                        font-size: 1rem;
                        letter-spacing: 0.15em;
                        color: #fff;
                        text-decoration: none;
                        text-transform: uppercase;
                        transition: color 0.2s;
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 0;
                    }
                    .nav-link:hover { color: var(--red); }

                    /* Red button */
                    .btn-red {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: var(--red);
                        color: #fff;
                        font-family: 'Bebas Neue', sans-serif;
                        font-size: 1rem;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        padding: 12px 28px;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                        transition: background 0.2s, transform 0.15s;
                    }
                    .btn-red:hover { background: #e0001f; transform: translateY(-1px); }

                    /* Outline button */
                    .btn-outline {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: transparent;
                        color: #fff;
                        font-family: 'Bebas Neue', sans-serif;
                        font-size: 1rem;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        padding: 12px 28px;
                        border: 1px solid rgba(255,255,255,0.4);
                        cursor: pointer;
                        text-decoration: none;
                        transition: border-color 0.2s, color 0.2s;
                    }
                    .btn-outline:hover { border-color: #fff; }

                    /* Slide fade-in animations */
                    .fade-up {
                        opacity: 0;
                        transform: translateY(40px);
                        transition: opacity 0.7s ease, transform 0.7s ease;
                    }
                    .fade-up.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    .fade-up.delay-1 { transition-delay: 0.1s; }
                    .fade-up.delay-2 { transition-delay: 0.2s; }
                    .fade-up.delay-3 { transition-delay: 0.3s; }
                    .fade-up.delay-4 { transition-delay: 0.4s; }
                    .fade-up.delay-5 { transition-delay: 0.5s; }

                    /* Hero word reveal animation */
                    @keyframes heroTextReveal {
                        0% {
                            opacity: 0;
                            transform: translateY(115%) rotate(2deg);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) rotate(0deg);
                        }
                    }
                    .hero-word-wrapper {
                        display: block;
                        overflow: hidden;
                        padding-bottom: 0.05em;
                    }
                    .hero-word {
                        display: inline-block;
                        opacity: 0;
                        will-change: transform, opacity;
                    }
                    .hero-word.animate {
                        animation: heroTextReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }

                    /* Noise overlay */
                    .noise-overlay {
                        position: absolute;
                        inset: 0;
                        background-image: url('/assets/framer/6mcf62RlDfRfU61Yg5vb2pefpi4.png');
                        background-size: 200px;
                        opacity: 0.04;
                        pointer-events: none;
                        z-index: 1;
                    }

                    /* Marquee */
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .marquee-track {
                        display: flex;
                        white-space: nowrap;
                        animation: marquee 18s linear infinite;
                    }
                    
                    /* Album card hover */
                    .album-card {
                        position: relative;
                        overflow: hidden;
                        cursor: pointer;
                        flex-shrink: 0;
                    }
                    .album-card img {
                        width: 100%;
                        aspect-ratio: 1;
                        object-fit: cover;
                        display: block;
                        transition: transform 0.5s ease, filter 0.5s ease;
                        filter: grayscale(30%);
                    }
                    .album-card:hover img {
                        transform: scale(1.05);
                        filter: grayscale(0%);
                    }
                    .album-card-info {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 20px 16px 16px;
                        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
                        transform: translateY(100%);
                        transition: transform 0.35s ease;
                    }
                    .album-card:hover .album-card-info {
                        transform: translateY(0);
                    }

                    /* Personnel card */
                    .personel-card {
                        position: relative;
                        overflow: hidden;
                        cursor: pointer;
                        flex-shrink: 0;
                    }
                    .personel-card img {
                        width: 100%;
                        height: 380px;
                        object-fit: cover;
                        object-position: top;
                        display: block;
                        filter: grayscale(100%);
                        transition: filter 0.4s ease, transform 0.4s ease;
                    }
                    .personel-card:hover img {
                        filter: grayscale(0%);
                        transform: scale(1.03);
                    }

                    /* Footer link */
                    .footer-link {
                        font-family: 'Bebas Neue', sans-serif;
                        font-size: 1.1rem;
                        letter-spacing: 0.15em;
                        color: rgba(255,255,255,0.5);
                        text-decoration: none;
                        text-transform: uppercase;
                        transition: color 0.2s;
                    }
                    .footer-link:hover { color: #fff; }

                    /* Divider line */
                    .divider { width: 100%; height: 1px; background: rgba(255,255,255,0.08); }

                    /* Section padding */
                    .section-pad { padding: 120px 20px; }
                    @media (max-width: 768px) { .section-pad { padding: 80px 20px; } }

                    /* Responsive grid */
                    .personel-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 2px;
                        width: 100%;
                    }
                    @media (min-width: 768px) {
                        .personel-grid {
                            grid-template-columns: repeat(4, 1fr);
                        }
                    }
                `}</style>
            </Head>

            <div style={{ background: '#000', color: '#fff', minHeight: '100vh', position: 'relative' }}>

                {/* ========== NAVBAR ========== */}
                <header className="main-header" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '20px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: navScrolled ? 'rgba(0,0,0,0.92)' : 'transparent',
                    backdropFilter: navScrolled ? 'blur(12px)' : 'none',
                    borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.4s, backdrop-filter 0.4s',
                }}>
                    {/* Logo / Band Name */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bebas"
                        style={{ fontSize: '1.5rem', letterSpacing: '0.08em', color: '#fff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {bandName}
                    </button>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                        <button className="nav-link" onClick={() => scrollTo('about')}>About</button>
                        <button className="nav-link" onClick={() => scrollTo('personel')}>Personel</button>
                        <button className="nav-link" onClick={() => scrollTo('originals')}>Originals</button>
                        {appSettings?.instagram_url && (
                            <a href={appSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
                        )}
                    </nav>
                </header>

                {/* ========== HERO SECTION ========== */}
                <section
                    id="hero"
                    ref={heroRef as React.RefObject<HTMLElement>}
                    style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                    {/* Background image */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <img
                            src={heroBgImage}
                            alt="Hero background"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        />
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.95) 100%)'
                        }} />
                        {/* Noise */}
                        <div className="noise-overlay" />
                    </div>

                    {/* Band name - large display */}
                    <div style={{
                        position: 'relative', zIndex: 10,
                        width: '100%',
                        padding: '0 40px 80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}>
                        <h1 className="bebas" style={{
                            fontSize: 'clamp(72px, 14vw, 200px)',
                            lineHeight: 0.85,
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            mixBlendMode: 'difference',
                        }}>
                            {bandName.split(' ').map((word, i) => (
                                <span key={i} className="hero-word-wrapper">
                                    <span
                                        className={`hero-word ${heroInView ? 'animate' : ''}`}
                                        style={{ animationDelay: `${i * 0.18 + 0.15}s` }}
                                    >
                                        {word}
                                        {i === 0 && (
                                            <span style={{ color: 'var(--red)', display: 'inline' }}> —</span>
                                        )}
                                    </span>
                                </span>
                            ))}
                        </h1>

                        <div
                            className={`fade-up ${heroInView ? 'visible' : ''}`}
                            style={{
                                display: 'flex',
                                gap: 16,
                                marginTop: 40,
                                flexWrap: 'wrap',
                                transitionDelay: `${bandName.split(' ').length * 0.18 + 0.2}s`
                            }}
                        >
                            {newAlbum?.active !== false && (
                                <a href="#new-album" className="btn-red" onClick={(e) => { e.preventDefault(); scrollTo('new-album'); }}>
                                    Listen Now
                                </a>
                            )}
                            <button className="btn-outline" onClick={() => scrollTo('about')}>
                                About Us
                            </button>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div style={{ position: 'absolute', bottom: 30, right: 40, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
                            Scroll
                        </span>
                        <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '40%',
                                background: 'var(--red)',
                                animation: 'scrollDot 1.8s ease-in-out infinite',
                            }} />
                        </div>
                    </div>

                    <style>{`
                        @keyframes scrollDot {
                            0% { transform: translateY(-100%); }
                            100% { transform: translateY(300%); }
                        }
                    `}</style>
                </section>

                {/* ========== NEW ALBUM TICKER ========== */}
                {(latestOriginal || newAlbum?.active !== false) && (
                    <div style={{ background: 'var(--red)', overflow: 'hidden', padding: '16px 0' }}>
                        <div className="marquee-track">
                            {[...Array(6)].map((_, i) => (
                                <span key={i} className="bebas" style={{ fontSize: '1.1rem', letterSpacing: '0.2em', color: '#fff', paddingRight: 60, whiteSpace: 'nowrap' }}>
                                    {latestOriginal?.judul || newAlbum?.title || 'Merayakan Luka'} — IS OUT NOW &nbsp;&nbsp;★&nbsp;&nbsp;
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== ABOUT SECTION ========== */}
                {aboutSection?.active !== false && (
                    <section
                        id="about"
                        ref={aboutRef as React.RefObject<HTMLElement>}
                        className="section-pad"
                        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '100%' }}
                    >
                        <div className="noise-overlay" />

                        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, width: '100%', margin: '0 auto' }}>
                            {/* Small label */}
                            <p
                                className={`bebas fade-up ${aboutInView ? 'visible' : ''}`}
                                style={{ fontSize: '0.85rem', letterSpacing: '0.3em', color: 'var(--red)', marginBottom: 24, textTransform: 'uppercase' }}
                            >
                                {aboutSection?.title || 'About the band'}
                            </p>

                            {/* Large display quote */}
                            <h2
                                className={`bebas fade-up delay-1 ${aboutInView ? 'visible' : ''}`}
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                    lineHeight: 0.9,
                                    color: 'var(--red)',
                                    textTransform: 'uppercase',
                                    marginBottom: 60,
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {bandName.split(' ').join('\n')}
                            </h2>

                            {/* Description text */}
                            <p
                                className={`fade-up delay-2 ${aboutInView ? 'visible' : ''}`}
                                style={{
                                    fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.7)',
                                    maxWidth: 720,
                                    margin: '0 auto 48px',
                                    fontWeight: 400,
                                }}
                            >
                                {aboutSection?.description ||
                                    "Weren't built to be consumed. Built to be felt. Born in Indonesia, forged in noise — the band carries the weight of everything left unsaid and turns it into organised chaos, electric tension, and groove that doesn't apologise. Dirty rock. No filter."}
                            </p>

                            {/* About image if exists */}
                            {aboutSection?.image_url && (
                                <div className={`fade-up delay-3 ${aboutInView ? 'visible' : ''}`} style={{ marginTop: 48, display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <img
                                        src={aboutSection.image_url}
                                        alt="About"
                                        style={{ width: '100%', maxWidth: 700, height: 400, objectFit: 'cover', filter: 'grayscale(20%)', margin: '0 auto', display: 'block' }}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <div className="divider" />

                {/* ========== NEW ALBUM SECTION ========== */}
                <section
                    id="new-album"
                    ref={albumRef as React.RefObject<HTMLElement>}
                    className="section-pad"
                    style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minHeight: '70vh', overflow: 'hidden' }}
                >
                    <div className="noise-overlay" />

                    {/* Background subtle red gradient */}
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at left, rgba(255,43,75,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap' }}>
                        {/* Left: text info */}
                        <div style={{ flex: '1 1 400px' }}>
                            <p
                                className={`bebas fade-up ${albumInView ? 'visible' : ''}`}
                                style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase' }}
                            >
                                {newAlbum?.release_date ? `released: ${newAlbum.release_date}` : 'New Release'}
                            </p>

                            <h2
                                className={`bebas fade-up delay-1 ${albumInView ? 'visible' : ''}`}
                                style={{
                                    fontSize: 'clamp(4rem, 10vw, 9rem)',
                                    lineHeight: 0.88,
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-0.02em',
                                    marginBottom: 8,
                                }}
                            >
                                {latestOriginal?.judul || newAlbum?.title || 'Merayakan\nLuka'}
                            </h2>

                            <p
                                className={`bebas fade-up delay-2 ${albumInView ? 'visible' : ''}`}
                                style={{ fontSize: '1.8rem', color: 'var(--red)', letterSpacing: '0.05em', marginBottom: 40 }}
                            >
                                is out now
                            </p>

                            <div className={`fade-up delay-3 ${albumInView ? 'visible' : ''}`} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {latestOriginal?.link_spotify ? (
                                    <a href={latestOriginal.link_spotify} target="_blank" rel="noopener noreferrer" className="btn-red">
                                        ▶ Listen on Spotify
                                    </a>
                                ) : appSettings?.spotify_url ? (
                                    <a href={appSettings.spotify_url} target="_blank" rel="noopener noreferrer" className="btn-red">
                                        ▶ Spotify
                                    </a>
                                ) : (
                                    <a href="#" className="btn-red">▶ Listen Now</a>
                                )}
                                {appSettings?.apple_music_url && (
                                    <a href={appSettings.apple_music_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                                        Apple Music
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right: album cover */}
                        <div
                            className={`fade-up delay-2 ${albumInView ? 'visible' : ''}`}
                            style={
                                isMobile
                                    ? {
                                        position: 'absolute',
                                        right: '0px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 'clamp(220px, 30vw, 360px)',
                                        zIndex: 1,
                                        filter: 'blur(12px)',
                                        opacity: 0.4,
                                        pointerEvents: 'none',
                                        overflow: 'hidden',
                                      }
                                    : {
                                        flex: '0 0 auto',
                                        width: 'clamp(220px, 30vw, 360px)',
                                        position: 'relative',
                                        zIndex: 2,
                                      }
                            }
                        >
                            {latestOriginal?.link_spotify && !isMobile ? (
                                <a href={latestOriginal.link_spotify} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                    <img
                                        src={latestOriginal?.image_url || discList[0]?.cover_url || '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp'}
                                        alt={latestOriginal?.judul || newAlbum?.title || 'New Release'}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            objectFit: 'cover',
                                            display: 'block',
                                            boxShadow: '0 40px 80px rgba(255,43,75,0.2), 0 0 0 1px rgba(255,255,255,0.04)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                </a>
                            ) : (
                                <img
                                    src={latestOriginal?.image_url || discList[0]?.cover_url || '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp'}
                                    alt={latestOriginal?.judul || newAlbum?.title || 'New Release'}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        objectFit: 'cover',
                                        display: 'block',
                                        boxShadow: isMobile ? 'none' : '0 40px 80px rgba(255,43,75,0.2), 0 0 0 1px rgba(255,255,255,0.04)',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </section>

                <div className="divider" />

                {/* ========== VIDEO REEL SECTION ========== */}
                <section id="reel" style={{ position: 'relative', width: '100%', background: '#000' }}>
                    {/* Floating text label */}
                    <div style={{ padding: '60px 40px 20px', textAlign: 'center' }}>
                        <p className="bebas" style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                            Latest Video
                        </p>
                    </div>

                    {/* Video embed area - YouTube */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 1200,
                        margin: '0 auto',
                        padding: '0 40px 80px',
                    }}>
                        {(() => {
                            const videoUrl = appSettings?.latest_video_url || appSettings?.youtube_url;
                            const ytId = extractYoutubeId(videoUrl);
                            const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : heroBgImage;

                            const content = (
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    paddingBottom: '56.25%',
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    overflow: 'hidden',
                                    cursor: videoUrl ? 'pointer' : 'default',
                                }}>
                                    <img
                                        src={thumbnail}
                                        alt="Latest video thumbnail"
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                        <div
                                            className="bebas"
                                            style={{
                                                width: 72, height: 72, borderRadius: '50%', background: 'var(--red)',
                                                border: 'none', fontSize: '1.5rem', color: '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 0 40px rgba(255,43,75,0.4)',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                        >
                                            ▶
                                        </div>
                                        <p className="bebas" style={{ fontSize: '1rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
                                            Watch our latest video
                                        </p>
                                    </div>
                                </div>
                            );

                            return videoUrl ? (
                                <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                                    {content}
                                </a>
                            ) : content;
                        })()}
                    </div>
                </section>

                <div className="divider" />
                

                {/* ========== PERSONEL SECTION ========== */}
                <section
                    id="personel"
                    ref={personelRef as React.RefObject<HTMLElement>}
                    className="section-pad"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
                        {/* Section header */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
                            <div>
                                <p className="bebas" style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'var(--red)', marginBottom: 8 }}>
                                    Meet the band
                                </p>
                                <h2
                                    className={`bebas fade-up ${personelInView ? 'visible' : ''}`}
                                    style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}
                                >
                                    Our Personel
                                </h2>
                            </div>

                            {/* Slider controls */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => setPersonelIndex(Math.max(0, personelIndex - 1))}
                                    disabled={personelIndex === 0}
                                    style={{
                                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                                        color: personelIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                                        cursor: personelIndex === 0 ? 'default' : 'pointer', fontSize: '1.2rem',
                                        transition: 'border-color 0.2s, color 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setPersonelIndex(Math.min(personelMaxIndex, personelIndex + 1))}
                                    disabled={personelIndex >= personelMaxIndex}
                                    style={{
                                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                                        color: personelIndex >= personelMaxIndex ? 'rgba(255,255,255,0.2)' : '#fff',
                                        cursor: personelIndex >= personelMaxIndex ? 'default' : 'pointer', fontSize: '1.2rem',
                                        transition: 'border-color 0.2s, color 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {/* Personel cards slider */}
                        <div
                            style={{ overflow: 'hidden' }}
                            onTouchStart={(e) => {
                                setTouchEndX(null);
                                setTouchStartX(e.targetTouches[0].clientX);
                            }}
                            onTouchMove={(e) => setTouchEndX(e.targetTouches[0].clientX)}
                            onTouchEnd={() => {
                                if (!touchStartX || !touchEndX) return;
                                const distance = touchStartX - touchEndX;
                                if (distance > 50) {
                                    setPersonelIndex(Math.min(personelMaxIndex, personelIndex + 1));
                                } else if (distance < -50) {
                                    setPersonelIndex(Math.max(0, personelIndex - 1));
                                }
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                gap: 2,
                                transform: `translateX(calc(-${personelIndex} * (100% / ${personelItemsPerView} + 0.7px)))`,
                                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            }}>
                                {memberList.map((member, idx) => (
                                    <div
                                        key={member.id}
                                        className={`personel-card fade-up delay-${Math.min(idx + 1, 5)} ${personelInView ? 'visible' : ''}`}
                                        style={{
                                            width: `calc(100% / ${personelItemsPerView} - 2px)`,
                                            minWidth: `calc(100% / ${personelItemsPerView} - 2px)`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: '#0a0a0a',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src={member.image_url ?? 'https://i.pravatar.cc/400'}
                                            alt={member.nama}
                                        />
                                        {/* Info overlay */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            padding: '40px 20px 20px',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                                        }}>
                                            <p className="bebas" style={{ fontSize: '1.3rem', letterSpacing: '0.05em', color: '#fff', lineHeight: 1.1 }}>
                                                {member.nama}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--red)', textTransform: 'uppercase', marginTop: 4, fontWeight: 600 }}>
                                                {member.posisi}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== DISCOGRAPHY SECTION ========== */}
                <section
                    id="originals"
                    ref={discRef as React.RefObject<HTMLElement>}
                    className="section-pad"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <div className="noise-overlay" />

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
                        {/* Section header */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
                            <div>
                                <p className="bebas" style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'var(--red)', marginBottom: 8 }}>
                                    Our Discography
                                </p>
                                <h2 className={`bebas fade-up ${discInView ? 'visible' : ''}`}
                                    style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                                    Originals
                                </h2>
                            </div>

                            {/* Slider controls */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => setDiscIndex(Math.max(0, discIndex - 1))}
                                    disabled={discIndex === 0}
                                    style={{
                                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                                        color: discIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                                        cursor: discIndex === 0 ? 'default' : 'pointer', fontSize: '1.2rem',
                                        transition: 'border-color 0.2s, color 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setDiscIndex(Math.min(maxIndex, discIndex + 1))}
                                    disabled={discIndex >= maxIndex}
                                    style={{
                                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                                        color: discIndex >= maxIndex ? 'rgba(255,255,255,0.2)' : '#fff',
                                        cursor: discIndex >= maxIndex ? 'default' : 'pointer', fontSize: '1.2rem',
                                        transition: 'border-color 0.2s, color 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {/* Album cards slider */}
                        <div
                            style={{ overflow: 'hidden' }}
                            onTouchStart={(e) => {
                                setTouchEndX(null);
                                setTouchStartX(e.targetTouches[0].clientX);
                            }}
                            onTouchMove={(e) => setTouchEndX(e.targetTouches[0].clientX)}
                            onTouchEnd={() => {
                                if (!touchStartX || !touchEndX) return;
                                const distance = touchStartX - touchEndX;
                                if (distance > 50) {
                                    setDiscIndex(Math.min(maxIndex, discIndex + 1));
                                } else if (distance < -50) {
                                    setDiscIndex(Math.max(0, discIndex - 1));
                                }
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                gap: 2,
                                transform: `translateX(calc(-${discIndex} * (100% / ${discItemsPerView} + 0.7px)))`,
                                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            }}>
                                {discList.map((album, idx) => {
                                    const cardChildren = (
                                        <>
                                            <img
                                                src={album.cover_url || '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp'}
                                                alt={album.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {/* Always-visible title */}
                                            <div style={{
                                                padding: '12px 0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'baseline',
                                            }}>
                                                <span className="bebas" style={{ fontSize: '1.1rem', letterSpacing: '0.05em', color: '#fff' }}>
                                                    {album.title}
                                                </span>
                                                {album.year ? (
                                                    <span className="bebas" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                                                        {album.year}
                                                    </span>
                                                ) : null}
                                            </div>
                                            {/* Hover overlay info */}
                                            <div className="album-card-info">
                                                <span className="bebas" style={{ display: 'block', fontSize: '1rem', color: '#fff', letterSpacing: '0.1em' }}>
                                                    {album.link_spotify ? 'Listen on Spotify →' : 'Play Now →'}
                                                </span>
                                            </div>
                                        </>
                                    );

                                    return album.link_spotify ? (
                                        <a
                                            key={album.id}
                                            href={album.link_spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`album-card fade-up delay-${Math.min(idx + 1, 5)} ${discInView ? 'visible' : ''}`}
                                            style={{
                                                width: `calc(100% / ${discItemsPerView} - 2px)`,
                                                minWidth: `calc(100% / ${discItemsPerView} - 2px)`,
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                                display: 'block',
                                            }}
                                        >
                                            {cardChildren}
                                        </a>
                                    ) : (
                                        <div
                                            key={album.id}
                                            className={`album-card fade-up delay-${Math.min(idx + 1, 5)} ${discInView ? 'visible' : ''}`}
                                            style={{ width: `calc(100% / ${discItemsPerView} - 2px)`, minWidth: `calc(100% / ${discItemsPerView} - 2px)` }}
                                        >
                                            {cardChildren}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider" />


                <div className="divider" style={{ marginTop: 2 }} />

                {/* ========== FOOTER ========== */}
                <footer style={{ position: 'relative', padding: '80px 40px 60px', overflow: 'hidden' }}>
                    <div className="noise-overlay" />

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 80 }}>
                            {/* Band name */}
                            <div>
                                <h3 className="bebas" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                                    {bandName.split(' ').map((w, i) => (
                                        <span key={i} style={{ display: 'block', color: i === 1 ? 'var(--red)' : '#fff' }}>{w}</span>
                                    ))}
                                </h3>
                            </div>

                            {/* Links grid */}
                            <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 60px' }}>
                                <button className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Home</button>
                                {appSettings?.email && (
                                    <a href={`mailto:${appSettings.email}`} className="footer-link">Email</a>
                                )}
                                <button className="footer-link" onClick={() => scrollTo('about')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>About</button>
                                {appSettings?.phone_number && (
                                    <a href={`https://wa.me/${appSettings.phone_number}`} className="footer-link" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                                )}
                                <button className="footer-link" onClick={() => scrollTo('personel')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Personel</button>
                                {appSettings?.instagram_url && (
                                    <a href={appSettings.instagram_url} className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a>
                                )}
                                <button className="footer-link" onClick={() => scrollTo('originals')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Originals</button>
                                {appSettings?.youtube_url && (
                                    <a href={appSettings.youtube_url} className="footer-link" target="_blank" rel="noopener noreferrer">YouTube</a>
                                )}
                            </nav>

                            {/* Streaming links */}
                            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <p className="bebas" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Listen On</p>
                                {[
                                    { label: 'Spotify', url: appSettings?.spotify_url },
                                    { label: 'Deezer', url: appSettings?.deezer_url },
                                    { label: 'Apple Music', url: appSettings?.apple_music_url },
                                ].map(({ label, url }) => (
                                    <a
                                        key={label}
                                        href={url || '#'}
                                        className="footer-link"
                                        target={url ? '_blank' : undefined}
                                        rel="noopener noreferrer"
                                        style={{ color: url ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div> */}
                        </div>

                        <div className="divider" />

                        {/* Bottom row */}
                        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
                                © {new Date().getFullYear()} {bandName}. All rights reserved.
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em' }}>
                                Band & Artist Website
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
