import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { 
    Check, 
    Flame, 
    Globe2, 
    Headphones, 
    Radio, 
    Sparkles, 
    Star, 
    Terminal, 
    Volume2, 
    Zap,
    ArrowUpRight,
    MessageSquare,
    Smile,
    ChevronLeft,
    ChevronRight,
    Music2,
    Mail,
    Phone,
    Instagram,
    Youtube
} from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
    );
}

function SpotifyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.62-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
        </svg>
    );
}

function AppleMusicIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.07c.6-0.74 1.01-1.76.9-2.78-.87.04-1.92.58-2.54 1.31-.55.63-1.03 1.66-.9 2.67.97.08 1.96-.48 2.54-1.2z" />
        </svg>
    );
}

type SharedProps = {
    appSettings?: {
        app_name: string;
        logo_url: string | null;
        email: string | null;
        phone_number: string | null;
        instagram_url: string | null;
        tiktok_url: string | null;
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
        spotify_artwork_url?: string | null;
        link_spotify: string | null;
        link_apple_music: string | null;
    }[];
};

function extractYoutubeId(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
}

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
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

export default function LandingPage() {
    const { appSettings, aboutSection, heroSlides, personel, newAlbum, originals } = usePage<SharedProps>().props;

    // Smooth scroll with header offset (like landing_backup)
    const scrollTo = (id: string) => {
        const targetId = id === 'pricing' ? 'personel' : id;
        const el = document.getElementById(targetId) || document.getElementById(id);
        if (el) {
            const navHeight = 75;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Scroll-triggered animations (like landing_backup)
    const { ref: aboutRef, inView: aboutInView } = useInView(0.12);
    const { ref: albumRef, inView: albumInView } = useInView(0.12);
    const { ref: reelRef, inView: reelInView } = useInView(0.12);
    const { ref: personelRef, inView: personelInView } = useInView(0.12);
    const { ref: originalsRef, inView: originalsInView } = useInView(0.12);
    const { ref: subscribeRef, inView: subscribeInView } = useInView(0.12);

    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    // Latest original track (most recent upload from originals table)
    const latestOriginal = originals && originals.length > 0 ? originals[0] : null;

    // Real carousel data from table hero_slides (no dummy data)
    const activeSlides = heroSlides && heroSlides.length > 0 ? heroSlides : [];

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    };

    // Autoplay carousel
    useEffect(() => {
        if (isPaused || activeSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [isPaused, activeSlides.length, currentSlide]);

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        if (distance > 50) {
            nextSlide();
        } else if (distance < -50) {
            prevSlide();
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    // Responsive Window Width for sliders
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Personel Slider State (from personel table)
    const memberList = personel && personel.length > 0 ? personel : [];
    const personelItemsPerView = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 4;
    const [personelIndex, setPersonelIndex] = useState(0);
    const personelMaxIndex = Math.max(0, memberList.length - personelItemsPerView);

    useEffect(() => {
        if (personelIndex > personelMaxIndex) {
            setPersonelIndex(personelMaxIndex);
        }
    }, [personelMaxIndex, personelIndex]);

    // Touch swipe state for Personel Slider on mobile (like landing_backup.tsx)
    const [personelTouchStartX, setPersonelTouchStartX] = useState<number | null>(null);
    const [personelTouchEndX, setPersonelTouchEndX] = useState<number | null>(null);

    const handlePersonelTouchEnd = () => {
        if (personelTouchStartX === null || personelTouchEndX === null) return;
        const distance = personelTouchStartX - personelTouchEndX;
        if (distance > 40) {
            setPersonelIndex((prev) => Math.min(personelMaxIndex, prev + 1));
        } else if (distance < -40) {
            setPersonelIndex((prev) => Math.max(0, prev - 1));
        }
        setPersonelTouchStartX(null);
        setPersonelTouchEndX(null);
    };

    // Originals Slider State (from originals table)
    const originalsList = originals && originals.length > 0 ? originals : [];
    const originalsItemsPerView = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
    const [originalsIndex, setOriginalsIndex] = useState(0);
    const originalsMaxIndex = Math.max(0, originalsList.length - originalsItemsPerView);

    useEffect(() => {
        if (originalsIndex > originalsMaxIndex) {
            setOriginalsIndex(originalsMaxIndex);
        }
    }, [originalsMaxIndex, originalsIndex]);

    // Touch swipe state for Originals Slider on mobile (like landing_backup.tsx)
    const [originalsTouchStartX, setOriginalsTouchStartX] = useState<number | null>(null);
    const [originalsTouchEndX, setOriginalsTouchEndX] = useState<number | null>(null);

    // Spotify Artwork auto-resolution & client cache
    const [spotifyArtworks, setSpotifyArtworks] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        if (originals) {
            originals.forEach((track) => {
                if (track.spotify_artwork_url) {
                    initial[track.id] = track.spotify_artwork_url;
                }
            });
        }
        return initial;
    });

    useEffect(() => {
        if (!originals) return;
        originals.forEach((track) => {
            if (!track.link_spotify || spotifyArtworks[track.id]) return;
            fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(track.link_spotify)}`)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data?.thumbnail_url) {
                        const highRes = data.thumbnail_url.replace('ab67616d00001e02', 'ab67616d0000b273');
                        setSpotifyArtworks((prev) => ({ ...prev, [track.id]: highRes }));
                    }
                })
                .catch(() => {});
        });
    }, [originals]);

    const getTrackArtwork = (track?: { id: number; image_url: string | null; spotify_artwork_url?: string | null } | null) => {
        if (!track) return null;
        return spotifyArtworks[track.id] || track.spotify_artwork_url || track.image_url || null;
    };

    const latestCover = getTrackArtwork(latestOriginal);

    const handleOriginalsTouchEnd = () => {
        if (originalsTouchStartX === null || originalsTouchEndX === null) return;
        const distance = originalsTouchStartX - originalsTouchEndX;
        if (distance > 40) {
            setOriginalsIndex((prev) => Math.min(originalsMaxIndex, prev + 1));
        } else if (distance < -40) {
            setOriginalsIndex((prev) => Math.max(0, prev - 1));
        }
        setOriginalsTouchStartX(null);
        setOriginalsTouchEndX(null);
    };

    // Jagged torn paper clip-path styles
    const tornPhotoClip = {
        clipPath: 'polygon(0% 4%, 4% 0%, 12% 3%, 24% 1%, 38% 4%, 52% 0%, 65% 3%, 78% 1%, 89% 4%, 97% 1%, 100% 7%, 98% 22%, 100% 36%, 97% 52%, 100% 68%, 98% 84%, 100% 96%, 95% 100%, 82% 97%, 69% 100%, 55% 97%, 42% 100%, 28% 98%, 15% 100%, 5% 97%, 0% 94%, 2% 78%, 0% 62%, 3% 45%, 0% 28%, 2% 14%)'
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff0055] selection:text-black font-sans relative overflow-x-hidden">
            <Head>
                <title>Homesick Sunday</title>
                {/* Google Fonts Preconnect & Import */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Montserrat:wght@700;800;900&family=Permanent+Marker&family=Sedgwick+Ave&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" 
                    rel="stylesheet" 
                />

                {/* SEO Meta Tags */}
                <meta name="description" content="Homesick Sunday adalah band pop punk asal Yogyakarta. Dengarkan single terbaru 'Merayakan Luka' di Spotify dan Apple Music." />
                <meta name="keywords" content="Homesick Sunday, Pop Punk, Yogyakarta, Musik Indonesia, Band Indie, Merayakan Luka" />
                <meta name="author" content="Homesick Sunday" />
                
                {/* Open Graph / Facebook / WhatsApp */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.homesicksunday.com/" />
                <meta property="og:title" content="Homesick Sunday - Official Website" />
                <meta property="og:description" content="Homesick Sunday adalah band pop punk asal Yogyakarta. Dengarkan single terbaru 'Merayakan Luka'." />
                <meta property="og:image" content="https://www.homesicksunday.com/assets/poster/home.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="id_ID" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://www.homesicksunday.com/" />
                <meta property="twitter:title" content="Homesick Sunday - Official Website" />
                <meta property="twitter:description" content="Homesick Sunday adalah band pop punk asal Yogyakarta." />
                <meta property="twitter:image" content="https://www.homesicksunday.com/assets/poster/home.jpg" />

                {/* Canonical & Sitemap */}
                <link rel="canonical" href="https://www.homesicksunday.com/" />
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
            </Head>

            {/* Custom Embedded Styles for Grunge Y2K Effects */}
            <style dangerouslySetInnerHTML={{ __html: `
                @font-face {
                    font-family: 'Grindy Brush';
                    src: url('/assets/Grindy%20Brush.otf') format('opentype');
                    font-display: swap;
                }
                .font-grindy {
                    font-family: 'Grindy Brush', cursive, sans-serif;
                }
                @font-face {
                    font-family: 'Airone';
                    src: url('/assets/AironeFont-Demo.otf') format('opentype');
                    font-display: swap;
                }
                .font-airone {
                    font-family: 'Airone', cursive, sans-serif;
                }
                .font-montserrat {
                    font-family: 'Montserrat', sans-serif;
                }
                .font-marker {
                    font-family: 'Permanent Marker', 'Grindy Brush', cursive, sans-serif;
                }
                .font-sedgwick {
                    font-family: 'Sedgwick Ave', cursive, sans-serif;
                }
                .font-mono-raw {
                    font-family: 'Space Mono', monospace;
                }
                
                /* Dark Geometric Grid Overlay */
                .bg-grunge-grid {
                    background-image: 
                        linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
                    background-size: 36px 36px;
                }

                /* Noise Grain Texture Effect */
                .bg-noise {
                    background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0);
                    background-size: 4px 4px;
                }

                /* Text Strokes */
                .text-stroke-pink {
                    -webkit-text-stroke: 2px #ff0055;
                    color: transparent;
                }
                .text-stroke-yellow {
                    -webkit-text-stroke: 2px #ffea00;
                    color: transparent;
                }
                .text-stroke-white {
                    -webkit-text-stroke: 2px #ffffff;
                    color: transparent;
                }

                /* Scotch / Duct Tape Graphic */
                .tape-strip {
                    background: rgba(255, 255, 255, 0.22);
                    backdrop-filter: blur(2px);
                    border-left: 2px dashed rgba(0, 0, 0, 0.2);
                    border-right: 2px dashed rgba(0, 0, 0, 0.2);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
                }

                /* Glitch Shake Animation on Hover */
                @keyframes punk-twitch {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    20% { transform: translate(-2px, 2px) rotate(-1deg); }
                    40% { transform: translate(2px, -1px) rotate(1deg); }
                    60% { transform: translate(-1px, -2px) rotate(0deg); }
                    80% { transform: translate(2px, 2px) rotate(1deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                .hover-twitch:hover {
                    animation: punk-twitch 0.25s infinite;
                }

                /* Jagged Bottom / Top Borders */
                .torn-edge-top {
                    background: #0a0a0a;
                    clip-path: polygon(
                        0% 0%, 2% 20px, 5% 4px, 8% 22px, 12% 5px, 15% 18px, 
                        19% 3px, 23% 25px, 27% 6px, 31% 20px, 35% 2px, 39% 24px, 
                        43% 5px, 47% 22px, 51% 3px, 55% 26px, 59% 7px, 63% 21px, 
                        67% 4px, 71% 25px, 75% 6px, 79% 22px, 83% 2px, 87% 24px, 
                        91% 5px, 95% 21px, 98% 3px, 100% 24px, 
                        100% 100%, 0% 100%
                    );
                }

                .torn-edge-bottom {
                    clip-path: polygon(
                        0% 0%, 100% 0%, 100% calc(100% - 24px),
                        98% calc(100% - 3px), 95% calc(100% - 21px), 91% calc(100% - 5px),
                        87% calc(100% - 24px), 83% calc(100% - 2px), 79% calc(100% - 22px),
                        75% calc(100% - 6px), 71% calc(100% - 25px), 67% calc(100% - 4px),
                        63% calc(100% - 21px), 59% calc(100% - 7px), 55% calc(100% - 26px),
                        51% calc(100% - 3px), 47% calc(100% - 22px), 43% calc(100% - 5px),
                        39% calc(100% - 24px), 35% calc(100% - 2px), 31% calc(100% - 20px),
                        27% calc(100% - 6px), 23% calc(100% - 25px), 19% calc(100% - 3px),
                        15% calc(100% - 18px), 12% calc(100% - 5px), 8% calc(100% - 22px),
                        5% calc(100% - 4px), 2% calc(100% - 20px), 0% 100%
                    );
                }

                .torn-edge-top.torn-edge-bottom {
                    clip-path: polygon(
                        0% 20px, 2% 20px, 5% 4px, 8% 22px, 12% 5px, 15% 18px, 
                        19% 3px, 23% 25px, 27% 6px, 31% 20px, 35% 2px, 39% 24px, 
                        43% 5px, 47% 22px, 51% 3px, 55% 26px, 59% 7px, 63% 21px, 
                        67% 4px, 71% 25px, 75% 6px, 79% 22px, 83% 2px, 87% 24px, 
                        91% 5px, 95% 21px, 98% 3px, 100% 24px, 
                        100% calc(100% - 24px),
                        98% calc(100% - 3px), 95% calc(100% - 21px), 91% calc(100% - 5px),
                        87% calc(100% - 24px), 83% calc(100% - 2px), 79% calc(100% - 22px),
                        75% calc(100% - 6px), 71% calc(100% - 25px), 67% calc(100% - 4px),
                        63% calc(100% - 21px), 59% calc(100% - 7px), 55% calc(100% - 26px),
                        51% calc(100% - 3px), 47% calc(100% - 22px), 43% calc(100% - 5px),
                        39% calc(100% - 24px), 35% calc(100% - 2px), 31% calc(100% - 20px),
                        27% calc(100% - 6px), 23% calc(100% - 25px), 19% calc(100% - 3px),
                        15% calc(100% - 18px), 12% calc(100% - 5px), 8% calc(100% - 22px),
                        5% calc(100% - 4px), 2% calc(100% - 20px), 0% calc(100% - 20px)
                    );
                }

                /* Marquee Animation */
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex;
                    white-space: nowrap;
                    animation: marquee 24s linear infinite;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }

                html {
                    scroll-behavior: smooth;
                }

                /* Slide fade-in animations like landing_backup */
                .fade-up {
                    opacity: 0;
                    transform: translateY(35px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: opacity, transform;
                }
                .fade-up.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .fade-up.delay-1 { transition-delay: 0.15s; }
                .fade-up.delay-2 { transition-delay: 0.3s; }
                .fade-up.delay-3 { transition-delay: 0.45s; }
            ` }} />

            {/* Grid & Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-grunge-grid opacity-75 z-0" />
            <div className="fixed inset-0 pointer-events-none bg-noise opacity-30 z-0" />

            {/* Ambient Punk Color Flares */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff0055]/10 blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#ffea00]/10 blur-[160px] pointer-events-none z-0" />

            <div className="relative z-10">

                {/* ========================================================================= */}
                {/* NAVBAR */}
                {/* ========================================================================= */}
                <header className="border-b border-white/10 backdrop-blur-md bg-[#0a0a0a]/85 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center md:justify-between">
                        {/* Minimalist Logo */}
                        <div 
                            onClick={() => scrollTo('hero')}
                            className="flex items-center justify-center gap-3 group cursor-pointer text-center"
                        >
                            <div className="relative text-center">
                                <span className="font-grindy text-3xl sm:text-4xl tracking-wider text-[#ff0055] drop-shadow-[2px_2px_0px_#ffea00] transition-transform group-hover:scale-105 inline-block mr-3 sm:mr-4">
                                    Homesick
                                </span>
                                <span className="font-grindy text-3xl sm:text-4xl tracking-wider text-[#ff0055] drop-shadow-[2px_2px_0px_#ffea00] transition-transform group-hover:scale-105 inline-block">
                                    Sunday
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 font-mono-raw text-xs uppercase tracking-widest font-bold">
                            <button 
                                onClick={() => scrollTo('hero')}
                                className="text-white hover:text-[#ffea00] transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                                Home
                            </button>
                            <button 
                                onClick={() => scrollTo('about')}
                                className="text-white/80 hover:text-[#ff0055] transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                                About
                            </button>
                            <button 
                                onClick={() => scrollTo('reel')}
                                className="text-white/80 hover:text-[#ffea00] transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                                Video
                            </button>
                            <button 
                                onClick={() => scrollTo('personel')}
                                className="text-white/80 hover:text-[#ff0055] transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                                Personel
                            </button>
                            <button 
                                onClick={() => scrollTo('originals')}
                                className="text-white/80 hover:text-[#ff0055] transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                                Originals
                            </button>
                            {appSettings?.instagram_url && (
                                <a 
                                    href={appSettings.instagram_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="bg-[#ff0055] hover:bg-[#ffea00] text-white hover:text-black px-3.5 py-1.5 shadow-[2px_2px_0px_#fff] transition-all -rotate-1 hover:rotate-0 inline-flex items-center gap-1.5"
                                >
                                    <span>Instagram</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            )}
                            <a href="#subscribe" className="bg-[#ff0055] hover:bg-[#ffea00] text-white hover:text-black px-3.5 py-1.5 shadow-[2px_2px_0px_#fff] transition-all -rotate-1 hover:rotate-0 inline-flex items-center gap-1.5 nav-link">
                                <span>Contact</span>
                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </a>
                        </nav>
                    </div>
                </header>

                <main>
                    {/* ========================================================================= */}
                    {/* PHASE 0: HERO CAROUSEL SECTION */}
                    {/* ========================================================================= */}
                    <section 
                        id="hero"
                        className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden bg-black border-b-2 border-white/10"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={(e) => {
                            setTouchEndX(null);
                            setTouchStartX(e.targetTouches[0].clientX);
                        }}
                        onTouchMove={(e) => setTouchEndX(e.targetTouches[0].clientX)}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Background Slides with Fade & Zoom */}
                        <div className="absolute inset-0 z-0">
                            {activeSlides.map((slide, idx) => (
                                <div
                                    key={slide.id || idx}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                        currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                                    }`}
                                >
                                    {slide.image_url ? (
                                        <img 
                                            src={slide.image_url} 
                                            alt={slide.title}
                                            className={`w-full h-full object-cover object-center filter brightness-[0.5] contrast-[1.2] transition-transform duration-[7000ms] ease-out ${
                                                currentSlide === idx ? 'scale-105' : 'scale-100'
                                            }`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#0a0a0a] bg-grunge-grid opacity-80" />
                                    )}
                                    {/* Grungy Punk Gradients & Noise Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/30" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/40 to-transparent" />
                                    <div className="noise-overlay absolute inset-0 opacity-20 pointer-events-none bg-noise" />
                                </div>
                            ))}
                        </div>

                        {/* Tape Strip Accent Decoration */}
                        <div className="tape-strip absolute top-6 right-8 w-32 h-7 rotate-6 z-20 pointer-events-none hidden sm:block" />

                        {/* Slide Content Container */}
                        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 w-full flex-1 flex flex-col justify-center">
                            <div className="max-w-3xl">
                                
                                {/* Main Title from table */}
                                {activeSlides[currentSlide]?.title ? (
                                    <h1 className="font-grindy text-5xl sm:text-7xl lg:text-9xl tracking-tight leading-[0.9] uppercase text-[#ff0055] drop-shadow-[4px_4px_0px_#ffea00]">
                                        {activeSlides[currentSlide].title}
                                    </h1>
                                ) : (
                                    <h1 className="font-grindy text-5xl sm:text-7xl lg:text-9xl tracking-tight leading-[0.9] uppercase text-[#ff0055] drop-shadow-[4px_4px_0px_#ffea00]">
                                        {appSettings?.app_name || 'HOMESICK SUNDAY'}
                                    </h1>
                                )}

                                {/* Description from table */}
                                {activeSlides[currentSlide]?.description && (
                                    <p className="font-mono-raw text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xl leading-relaxed mt-6 border-l-2 border-[#ffea00] pl-4 bg-black/40 py-1.5 backdrop-blur-sm">
                                        {activeSlides[currentSlide].description}
                                    </p>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-4 mt-8">
                                    <a
                                        href="#subscribe"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollTo('subscribe');
                                        }}
                                        className="inline-flex items-center gap-2.5 bg-[#ff0055] hover:bg-[#ffea00] text-white hover:text-black font-marker text-lg sm:text-xl px-7 py-3 shadow-[4px_4px_0px_#ffea00] hover:shadow-[6px_6px_0px_#ffea00] transition-all -rotate-1 hover:rotate-0 cursor-pointer"
                                    >
                                        <Music2 className="w-5 h-5" />
                                        <span>LISTEN NOW</span>
                                    </a>
                                    <a
                                        href="#about"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollTo('about');
                                        }}
                                        className="inline-flex items-center gap-2 bg-black/80 hover:bg-white text-white hover:text-black border-2 border-white/40 hover:border-white font-mono-raw font-black text-xs sm:text-sm px-6 py-3 uppercase tracking-widest shadow-[4px_4px_0px_rgba(255,255,255,0.2)] transition-all rotate-1 hover:rotate-0 cursor-pointer"
                                    >
                                        <span>ABOUT THE BAND</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>

                            </div>
                        </div>

                        {/* Bottom Controls Bar (Only shown when multiple slides exist) */}
                        {activeSlides.length > 1 && (
                            <div className="relative z-20 border-t border-white/10 bg-black/70 backdrop-blur-md">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    
                                    {/* Indicators & Counter */}
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono-raw text-xs text-white/90 font-bold bg-white/10 px-3 py-1 border border-white/20">
                                            0{currentSlide + 1} / 0{activeSlides.length}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {activeSlides.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentSlide(i)}
                                                    aria-label={`Go to slide ${i + 1}`}
                                                    className={`h-2 transition-all cursor-pointer ${
                                                        currentSlide === i 
                                                            ? 'w-8 bg-[#ffea00] shadow-[0_0_8px_#ffea00]' 
                                                            : 'w-2.5 bg-white/30 hover:bg-white/60'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono-raw text-neutral-400 ml-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                                            <span>{isPaused ? 'PAUSED' : 'AUTOPLAY'}</span>
                                        </div>
                                    </div>

                                    {/* Prev / Next Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevSlide}
                                            aria-label="Previous Slide"
                                            className="w-10 h-10 bg-black/80 hover:bg-[#ff0055] text-white border border-white/30 hover:border-[#ff0055] flex items-center justify-center shadow-[3px_3px_0px_#000] hover:shadow-[3px_3px_0px_#ffea00] transition-all cursor-pointer group"
                                        >
                                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            aria-label="Next Slide"
                                            className="w-10 h-10 bg-black/80 hover:bg-[#ff0055] text-white border border-white/30 hover:border-[#ff0055] flex items-center justify-center shadow-[3px_3px_0px_#000] hover:shadow-[3px_3px_0px_#ffea00] transition-all cursor-pointer group"
                                        >
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Marquee Ticker (From landing_backup.tsx) */}
                        <div className="w-full bg-[#ffea00] text-black border-y-2 border-black overflow-hidden py-2.5 select-none relative z-20">
                            <div className="marquee-track font-marker text-sm sm:text-base tracking-widest uppercase">
                                {[...Array(6)].map((_, i) => (
                                    <span key={i} className="inline-flex items-center gap-5 px-6 whitespace-nowrap">
                                        <span>HOMESICK SUNDAY</span>
                                        <span className="text-[#ff0055]">★</span>
                                        <span>MERAYAKAN LUKA OUT NOW</span>
                                        <span className="text-[#ff0055]">★</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                    </section>

                    {/* ========================================================================= */}
                    {/* PHASE 1: ABOUT US & COLLAGE (DATA FROM ABOUT TABLE) */}
                    {/* ========================================================================= */}
                    {aboutSection?.active !== false && (
                        <section id="about" ref={aboutRef} className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                                
                                {/* Left Column: About Info from DB & Punk Stickers */}
                                <div className={`lg:col-span-5 space-y-8 order-2 lg:order-1 fade-up ${aboutInView ? 'visible' : ''}`}>
                                    
                                    {/* Raw Origin Tag */}
                                    <div className="inline-flex items-center gap-2 bg-[#ffea00] text-black font-mono-raw font-black text-xs px-3.5 py-1 uppercase shadow-[3px_3px_0px_#ff0055] -rotate-1">
                                        <Zap className="w-3.5 h-3.5 fill-black" />
                                        <span>HOMESICK SUNDAY // ORIGIN</span>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="font-airone text-4xl sm:text-6xl tracking-tight leading-none uppercase">
                                            {aboutSection?.title || 'About Us'}
                                        </h2>
                                        {aboutSection?.description && (
                                            <p className="text-[#d4d4d4] text-base sm:text-lg font-light leading-relaxed max-w-lg border-l-2 border-[#ff0055] pl-4 bg-white/[0.03] py-3">
                                                {aboutSection.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sticker Bomb Badges in Left Column */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <div className="inline-flex items-center gap-1.5 bg-white text-black font-mono-raw font-black text-[11px] px-3 py-1 border-2 border-dashed border-black rotate-1 shadow-[3px_3px_0px_#ff0055] uppercase">
                                            <Flame className="w-3.5 h-3.5 text-[#ff0055] fill-[#ff0055]" />
                                            <span>EST. 2016 // YOGYAKARTA</span>
                                        </div>
                                        <div className="inline-block bg-black text-[#ffea00] border-2 border-[#ffea00] font-mono-raw font-black text-[11px] px-3 py-1 -rotate-2 shadow-[2px_2px_0px_#000]">
                                            ⚠ 100% RAW DECIBELS
                                        </div>
                                    </div>
                                </div>

                                {/* Center/Right Column (Giant Typography, Collage & Sticker Bombing) */}
                                <div className={`lg:col-span-7 relative order-1 lg:order-2 flex flex-col items-center justify-center fade-up delay-1 ${aboutInView ? 'visible' : ''}`}>
                                    
                                    {/* Giant Overlapping Pink Brush Font Background */}
                                    <div className="relative w-full select-none text-center">
                                        <h1 className="font-grindy text-[18vw] sm:text-[140px] md:text-[170px] lg:text-[185px] leading-none tracking-tighter text-[#ff0055] drop-shadow-[4px_4px_0px_#ffea00] scale-y-110 opacity-95 transition-transform">
                                            Homesick
                                        </h1>
                                    </div>

                                    {/* Collage Container: Portrait with Jagged Torn Paper Frame & Sticker Ornaments */}
                                    <div className="relative -mt-12 sm:-mt-20 md:-mt-24 w-72 sm:w-96 md:w-[420px] aspect-[4/5] z-10">
                                        
                                        {/* Offset Neon Background Layer */}
                                        <div 
                                            className="absolute inset-0 bg-[#ffea00] translate-x-3 translate-y-3 -rotate-2"
                                            style={tornPhotoClip}
                                        />
                                        <div 
                                            className="absolute inset-0 bg-[#ff0055] -translate-x-2 -translate-y-2 rotate-1 opacity-90"
                                            style={tornPhotoClip}
                                        />

                                        {/* The Torn Paper Portrait with DB Image */}
                                        <div 
                                            className="relative w-full h-full overflow-hidden bg-black shadow-2xl border border-white/20"
                                            style={tornPhotoClip}
                                        >
                                            {aboutSection?.image_url ? (
                                                <img 
                                                    src={aboutSection.image_url} 
                                                    alt={aboutSection.title || 'Homesick Sunday'}
                                                    className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700 filter"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-900 bg-grunge-grid flex items-center justify-center text-center p-6 font-marker text-2xl text-white/40">
                                                    HOMESICK SUNDAY
                                                </div>
                                            )}
                                            
                                            {/* Half-tone / Dark Gradient Wash */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent mix-blend-multiply" />
                                            
                                            {/* Barcode Stamp Overlay */}
                                            <div className="absolute bottom-4 left-4 bg-black/90 border border-white/20 p-2 font-mono-raw text-[9px] text-white">
                                                <div className="tracking-[3px] text-xs font-black">||| | |||| || | |||</div>
                                                <div>BAND ID: HSS-2016-YK</div>
                                            </div>
                                        </div>

                                        {/* ============================================================= */}
                                        {/* STICKER BOMB ORNAMENTS (Like Phase 3 Sticker Bomb Section) */}
                                        {/* ============================================================= */}

                                        {/* Sticker 1: "PUNK AF!" Neon Pink Badge */}
                                        <div className="absolute -top-10 -left-6 sm:-left-10 bg-[#ff0055] text-white font-marker text-lg sm:text-2xl px-4 py-1.5 border-2 border-black -rotate-12 shadow-[4px_4px_0px_#ffea00] z-30 hover:scale-110 transition-transform cursor-pointer">
                                            PUNK AF!
                                        </div>

                                        {/* Sticker 2: "24/7 NOISE" Neon Yellow Sticker */}
                                        <div className="absolute -top-8 -right-4 sm:-right-8 bg-[#ffea00] text-black font-mono-raw font-black text-xs sm:text-sm px-3.5 py-1.5 border-2 border-black rotate-12 shadow-[3px_3px_0px_#000] z-30 hover:scale-110 transition-transform cursor-pointer">
                                            ★ POP PUNK RAW ★
                                        </div>

                                        {/* Sticker 3: Holographic Sparkles Star */}
                                        <div className="absolute top-1/3 -right-6 sm:-right-9 bg-[#ff0055] text-white p-2.5 rotate-45 border-2 border-white shadow-[3px_3px_0px_#000] z-20 hidden sm:block hover:rotate-90 transition-transform">
                                            <Sparkles className="w-4 h-4 -rotate-45" />
                                        </div>

                                        {/* Sticker 4: Acidic Oval Pill "RIOT NOISE" */}
                                        {/* <div className="absolute top-1/2 -left-6 sm:-left-12 bg-[#ffea00] text-black font-marker text-sm sm:text-base px-4 py-1.5 rounded-full border-2 border-black -rotate-6 shadow-[3px_3px_0px_#000] z-20 hover:rotate-3 transition-transform cursor-pointer">
                                            ⚡ RIOT NOISE
                                        </div> */}

                                        {/* Sticker 5: Warning Tape Barcode Sticker */}
                                        <div className="absolute -bottom-4 -right-4 sm:-right-8 bg-white text-black font-mono-raw text-[10px] px-3 py-1 border border-black rotate-3 shadow-[2px_2px_0px_#000] z-30">
                                            [NO RULES APPLIED]
                                        </div>

                                        {/* Duct Tape Over Corners */}
                                        <div className="tape-strip absolute -top-4 -left-6 w-28 h-8 -rotate-12 z-20 pointer-events-none" />
                                        <div className="tape-strip absolute -bottom-4 -right-4 w-32 h-8 rotate-6 z-20 pointer-events-none" />

                                        {/* Yellow Text Sticker pointing to band name */}
                                        <div className="absolute -bottom-6 -left-6 sm:-left-12 bg-[#ffea00] text-black border-2 border-black p-3 sm:p-4 shadow-[4px_4px_0px_#ff0055] rotate-[-7deg] z-30 max-w-[210px] hover:rotate-0 transition-transform cursor-pointer">
                                            <div className="tape-strip absolute -top-3 left-6 w-14 h-4 rotate-2" />
                                            
                                            <p className="font-marker text-lg sm:text-xl leading-tight text-black">
                                                "{appSettings?.app_name || 'Homesick Sunday'}"
                                            </p>
                                        </div>

                                        {/* Extra Y2K Punk Sticker badge */}
                                        <div className="absolute -top-4 right-1/4 bg-[#ff0055] text-white font-mono-raw font-black text-xs px-3 py-1.5 border-2 border-black -rotate-3 shadow-[3px_3px_0px_#000] z-30 uppercase">
                                            ★ Homesick ★
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                    )}


                    {/* ========================================================================= */}
                    {/* PHASE 3: NEW RELEASE / LATEST ORIGINAL SECTION (DATA FROM ORIGINALS TABLE) */}
                    {/* ========================================================================= */}
                    <section id="new-album" ref={albumRef} className="w-full relative bg-neutral-950/90 torn-edge-top torn-edge-bottom py-24 my-12 scroll-mt-24 overflow-hidden">
                        
                        {/* Background subtle neon radial glow */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#ffea00]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
                                
                                {/* Left Column: Release Details & Actions */}
                                <div className={`lg:col-span-7 space-y-6 fade-up ${albumInView ? 'visible' : ''}`}>
                                    
                                    {/* Raw Tag */}
                                    <div className="inline-flex items-center gap-2 bg-[#ffea00] text-black font-mono-raw font-black text-xs px-3.5 py-1 uppercase shadow-[3px_3px_0px_#ff0055] -rotate-1">
                                        <Flame className="w-3.5 h-3.5 fill-black" />
                                        <span>
                                            {newAlbum?.release_date ? `RELEASED: ${newAlbum.release_date}` : 'LATEST RELEASE // OUT NOW'}
                                        </span>
                                    </div>

                                    {/* Title with Brush font + Out now */}
                                    <div className="space-y-2">
                                        <h2 className="font-grindy text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.9] drop-shadow-[5px_5px_0px_#000] uppercase">
                                            {latestOriginal?.judul || newAlbum?.title || 'Merayakan Luka'}
                                        </h2>
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="font-grindy text-2xl sm:text-4xl text-[#ff0055] -rotate-2 inline-block drop-shadow-[2px_2px_0px_#000]">
                                                IS OUT NOW!
                                            </span>
                                            <span className="text-[#a3a3a3] font-mono-raw text-xs sm:text-sm tracking-widest uppercase">
                                                // STREAM WORLDWIDE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edgy Punk Description */}
                                    <p className="text-[#d4d4d4] text-base sm:text-lg font-light leading-relaxed max-w-xl border-l-2 border-[#ffea00] pl-4 bg-white/[0.03] py-3 font-sans">
                                        Turn the volume all the way up. Experience the raw street energy, loud distortion, and unapologetic pop punk decibels from the newest release of Homesick Sunday.
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        {latestOriginal?.link_spotify ? (
                                            <a
                                                href={latestOriginal.link_spotify}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono-raw font-black text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#ff0055] hover:shadow-[6px_6px_0px_#ffea00] transition-all inline-flex items-center gap-2.5 -rotate-1 hover:rotate-0"
                                            >
                                                <SpotifyIcon className="w-5 h-5 fill-black" />
                                                <span>LISTEN ON SPOTIFY</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                            </a>
                                        ) : appSettings?.spotify_url ? (
                                            <a
                                                href={appSettings.spotify_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono-raw font-black text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#ff0055] hover:shadow-[6px_6px_0px_#ffea00] transition-all inline-flex items-center gap-2.5 -rotate-1 hover:rotate-0"
                                            >
                                                <SpotifyIcon className="w-5 h-5 fill-black" />
                                                <span>SPOTIFY</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                            </a>
                                        ) : (
                                            <a 
                                                href="#originals" 
                                                onClick={(e) => { e.preventDefault(); scrollTo('originals'); }}
                                                className="bg-[#ff0055] hover:bg-[#ffea00] text-white hover:text-black font-mono-raw font-black text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#000] transition-all inline-flex items-center gap-2.5 -rotate-1 hover:rotate-0"
                                            >
                                                <Music2 className="w-5 h-5" />
                                                <span>STREAM NOW</span>
                                            </a>
                                        )}

                                        {latestOriginal?.link_apple_music ? (
                                            <a
                                                href={latestOriginal.link_apple_music}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#fa233b] hover:bg-[#fc3c44] text-white font-mono-raw font-black text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#ffea00] transition-all inline-flex items-center gap-2.5 rotate-1 hover:rotate-0"
                                            >
                                                <AppleMusicIcon className="w-5 h-5 fill-white" />
                                                <span>LISTEN ON APPLE MUSIC</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                            </a>
                                        ) : appSettings?.apple_music_url ? (
                                            <a
                                                href={appSettings.apple_music_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#fa233b] hover:bg-[#fc3c44] text-white font-mono-raw font-black text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#ffea00] transition-all inline-flex items-center gap-2.5 rotate-1 hover:rotate-0"
                                            >
                                                <AppleMusicIcon className="w-5 h-5 fill-white" />
                                                <span>APPLE MUSIC</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                            </a>
                                        ) : null}
                                    </div>

                                    {/* Sticker Badges Under Actions */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <div className="inline-flex items-center gap-1.5 bg-white text-black font-mono-raw font-black text-[11px] px-3 py-1 border-2 border-dashed border-black rotate-1 shadow-[3px_3px_0px_#ff0055] uppercase">
                                            <Sparkles className="w-3.5 h-3.5 text-[#ff0055]" />
                                            <span>ORIGINAL SINGLE</span>
                                        </div>
                                        <div className="inline-block bg-black text-[#ffea00] border-2 border-[#ffea00] font-mono-raw font-black text-[11px] px-3 py-1 -rotate-2 shadow-[2px_2px_0px_#000]">
                                            ⚡ HIGH GAIN DECIBELS
                                        </div>
                                        <div className="inline-block bg-[#ff0055] text-white font-mono-raw font-black text-[11px] px-3 py-1 rotate-2 shadow-[2px_2px_0px_#000]">
                                            ★ UNCENSORED AUDIO
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Album Artwork & Y2K Punk Collage / Stickers */}
                                <div className={`lg:col-span-5 flex items-center justify-center relative fade-up delay-1 ${albumInView ? 'visible' : ''}`}>
                                    
                                    <div className="relative w-72 sm:w-96 md:w-[420px] aspect-square">
                                        
                                        {/* Offset Neon Background Layer */}
                                        <div className="absolute inset-0 bg-[#ffea00] translate-x-4 translate-y-4 -rotate-3 border-2 border-black" />
                                        <div className="absolute inset-0 bg-[#ff0055] -translate-x-3 -translate-y-3 rotate-2 opacity-90 border-2 border-black" />

                                        {/* The Vinyl / Album Cover Frame */}
                                        <div className="relative w-full h-full bg-black border-2 border-white/20 shadow-2xl overflow-hidden group">
                                            {latestCover ? (
                                                <img
                                                    src={latestCover}
                                                    alt={latestOriginal?.judul || newAlbum?.title || 'Latest Release'}
                                                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 filter"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-center p-6">
                                                    <Music2 className="w-16 h-16 text-[#ffea00] mb-3" />
                                                    <span className="font-marker text-2xl text-white">HOMESICK SUNDAY</span>
                                                </div>
                                            )}

                                            {/* Half-tone gradient wash */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                                            {/* Vinyl Disk Badge */}
                                            <div className="absolute top-4 right-4 bg-black/90 border border-white/30 text-white font-mono-raw text-[10px] px-2.5 py-1 tracking-wider uppercase">
                                                LP // MASTER
                                            </div>

                                            {/* Barcode Stamp */}
                                            <div className="absolute bottom-4 left-4 bg-black/90 border border-white/20 p-2 font-mono-raw text-[9px] text-white">
                                                <div className="tracking-[3px] text-xs font-black">||| || | |||| || | |</div>
                                                <div>ID: HSS-REL-LATEST</div>
                                            </div>
                                        </div>

                                        {/* Duct Tape Over Corners */}
                                        <div className="tape-strip absolute -top-4 -left-6 w-28 h-8 -rotate-12 z-30 pointer-events-none" />
                                        <div className="tape-strip absolute -bottom-4 -right-4 w-32 h-8 rotate-6 z-30 pointer-events-none" />

                                        {/* Neon Sticker 1: "OUT NOW!" */}
                                        <div className="absolute -top-7 -right-4 sm:-right-8 bg-[#ff0055] text-white font-marker text-xl sm:text-2xl px-4 py-2 border-2 border-black rotate-12 shadow-[4px_4px_0px_#ffea00] z-30 hover:scale-110 transition-transform cursor-pointer">
                                            OUT NOW!
                                        </div>

                                        {/* Neon Sticker 2: Song Name Sticker */}
                                        <div className="absolute -bottom-6 -left-6 sm:-left-10 bg-[#ffea00] text-black border-2 border-black p-3 sm:p-3.5 shadow-[4px_4px_0px_#ff0055] rotate-[-7deg] z-30 hover:rotate-0 transition-transform cursor-pointer">
                                            <div className="tape-strip absolute -top-3 left-6 w-14 h-4 rotate-2" />
                                            <p className="font-marker text-base sm:text-lg leading-tight text-black">
                                                "{latestOriginal?.judul || newAlbum?.title || 'Merayakan Luka'}"
                                            </p>
                                        </div>

                                        {/* Sparkle badge */}
                                        <div className="absolute top-1/2 -right-5 bg-[#ff0055] text-white p-2.5 rotate-45 border-2 border-white shadow-[3px_3px_0px_#000] z-20 hidden sm:block">
                                            <Sparkles className="w-4 h-4 -rotate-45" />
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ========================================================================= */}
                    {/* PHASE 3.5: LATEST VIDEO REEL SECTION (DATA FROM APP_SETTINGS) */}
                    {/* ========================================================================= */}
                    {(() => {
                        const videoUrl = appSettings?.latest_video_url || appSettings?.youtube_url;
                        const ytId = extractYoutubeId(videoUrl);
                        const videoThumbnail = ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : (latestOriginal?.image_url || '/assets/framer/4Vs7smbTCJW7vqlJnZ9xvk5Tse8.webp');

                        return (
                            <section id="reel" ref={reelRef} className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-24">
                                <div className={`text-center mb-12 fade-up ${reelInView ? 'visible' : ''}`}>
                                    <div className="inline-flex items-center gap-2 bg-[#ff0055] text-white font-mono-raw font-black text-xs px-3.5 py-1 uppercase shadow-[3px_3px_0px_#ffea00] -rotate-1 mb-3">
                                        <Radio className="w-3.5 h-3.5 fill-white" />
                                        <span>OFFICIAL TRANSMISSION // MUSIC VIDEO</span>
                                    </div>
                                    <h2 className="flex flex-col md:flex-row md:flex-nowrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 leading-none">
                                        <span className="font-grindy text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#ffea00] drop-shadow-[4px_4px_0px_#000] md:whitespace-nowrap">
                                            WATCH OUR
                                        </span>
                                        <span className="font-airone text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase md:whitespace-nowrap">
                                            LATEST NOISE
                                        </span>
                                    </h2>
                                    <p className="text-[#a3a3a3] text-sm sm:text-base font-mono-raw mt-3 max-w-lg mx-auto">
                                        Stream our official music video and uncut live footage directly on YouTube.
                                    </p>
                                </div>

                                {/* Video Player Screen Frame */}
                                <div className={`relative mx-auto max-w-5xl fade-up delay-1 ${reelInView ? 'visible' : ''}`}>
                                    
                                    {/* Offset Neon Background Layer */}
                                    <div className="absolute inset-0 bg-[#ffea00] translate-x-3 translate-y-3 -rotate-1 border-2 border-black" />
                                    <div className="absolute inset-0 bg-[#ff0055] -translate-x-2 -translate-y-2 rotate-1 opacity-90 border-2 border-black" />

                                    {/* Video Screen Container */}
                                    <div className="relative w-full aspect-video bg-black border-4 border-black shadow-2xl overflow-hidden group">
                                        {isPlayingVideo && ytId ? (
                                             <iframe
                                                 src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                                                 title="Homesick Sunday Latest Video"
                                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                 referrerPolicy="strict-origin-when-cross-origin"
                                                 allowFullScreen
                                                 loading="lazy"
                                                 className="w-full h-full object-cover border-0"
                                             />
                                        ) : (
                                            <div 
                                                onClick={() => {
                                                    if (ytId) {
                                                        setIsPlayingVideo(true);
                                                    } else if (videoUrl) {
                                                        window.open(videoUrl, '_blank');
                                                    }
                                                }}
                                                className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
                                            >
                                                {/* Thumbnail */}
                                                <img
                                                    src={videoThumbnail}
                                                    alt="Latest video thumbnail"
                                                    crossOrigin="anonymous"
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 filter"
                                                    onError={(e) => {
                                                        if (ytId) {
                                                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
                                                        }
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                                {/* Pulsing Play Button */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#ff0055] text-white flex items-center justify-center border-4 border-black shadow-[0_0_35px_#ff0055] group-hover:bg-[#ffea00] group-hover:text-black group-hover:scale-110 transition-all">
                                                        <span className="font-marker text-3xl sm:text-4xl ml-1.5">▶</span>
                                                    </div>
                                                    <div className="bg-black/85 border border-white/20 px-4 py-1.5 font-mono-raw text-xs sm:text-sm text-white uppercase tracking-widest font-black -rotate-1 shadow-[2px_2px_0px_#ffea00]">
                                                        WATCH THE LATEST VIDEO
                                                    </div>
                                                </div>

                                                {/* Badge Overlay */}
                                                <div className="absolute top-4 right-4 bg-[#ff0055] text-white font-mono-raw font-black text-xs px-3 py-1 rotate-2 shadow-[2px_2px_0px_#000] uppercase">
                                                    ● LIVE AUDIO // YOUTUBE
                                                </div>

                                                {/* Barcode Stamp */}
                                                <div className="absolute bottom-4 left-4 bg-black/90 border border-white/20 p-2 font-mono-raw text-[9px] text-white hidden sm:block">
                                                    <div className="tracking-[3px] text-xs font-black">||| || | |||| || | |</div>
                                                    <div>ID: HSS-VID-REC</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Duct Tape Over Corners */}
                                        <div className="tape-strip absolute -top-4 -left-6 w-28 h-8 -rotate-12 z-30 pointer-events-none" />
                                        <div className="tape-strip absolute -bottom-4 -right-4 w-32 h-8 rotate-6 z-30 pointer-events-none" />
                                    </div>

                                    {/* Action Link under video */}
                                    {videoUrl && (
                                        <div className="flex justify-center mt-8">
                                            <a
                                                href={videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#ff0055] hover:bg-[#ffea00] text-white hover:text-black font-mono-raw font-black text-xs sm:text-sm px-6 py-3.5 uppercase shadow-[4px_4px_0px_#000] inline-flex items-center gap-2.5 transition-all -rotate-1 hover:rotate-0"
                                            >
                                                <Radio className="w-4 h-4 fill-current" />
                                                <span>OPEN ON YOUTUBE</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                            </a>
                                        </div>
                                    )}

                                </div>
                            </section>
                        );
                    })()}


                    {/* ========================================================================= */}
                    {/* PHASE 4: PERSONEL SECTION (DATA FROM TABLE PERSONEL + MOBILE SWIPE) */}
                    {/* ========================================================================= */}
                    <section id="personel" ref={personelRef} className="w-full relative bg-neutral-950/90 torn-edge-top torn-edge-bottom py-24 my-12 scroll-mt-24">
                        <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        
                        {/* Section Header: Title & Slider Controls */}
                        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 mb-16 fade-up ${personelInView ? 'visible' : ''}`}>
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-[#ff0055] text-white font-mono-raw font-black text-xs px-3.5 py-1 uppercase shadow-[3px_3px_0px_#ffea00] -rotate-1 mb-3">
                                    <Flame className="w-3.5 h-3.5 fill-white" />
                                    <span>MEET THE BAND // ROSTER</span>
                                </div>
                                <h2 className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 leading-none">
                                    <span className="font-grindy text-5xl sm:text-7xl lg:text-8xl text-[#ff0055] drop-shadow-[4px_4px_0px_#000]">
                                        OUR
                                    </span>
                                    <span className="font-airone text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase font-sans">
                                        PERSONEL
                                    </span>
                                </h2>
                                <p className="text-[#a3a3a3] text-sm sm:text-base font-mono-raw mt-2 max-w-lg">
                                    The raw energy, attitude, and rebellious noise makers of Homesick Sunday.
                                </p>
                            </div>

                            {/* Slider Navigation Buttons (Active when items exceed view) */}
                            {memberList.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPersonelIndex(Math.max(0, personelIndex - 1))}
                                        disabled={personelIndex === 0}
                                        className={`w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 ${
                                            personelIndex === 0
                                                ? 'border-white/10 text-white/20 cursor-not-allowed bg-black/40'
                                                : 'border-[#ffea00] text-black bg-[#ffea00] shadow-[3px_3px_0px_#ff0055] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer'
                                        }`}
                                        aria-label="Previous Personel"
                                    >
                                        <ChevronLeft className="w-6 h-6 stroke-[3]" />
                                    </button>
                                    <button
                                        onClick={() => setPersonelIndex(Math.min(personelMaxIndex, personelIndex + 1))}
                                        disabled={personelIndex >= personelMaxIndex}
                                        className={`w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 ${
                                            personelIndex >= personelMaxIndex
                                                ? 'border-white/10 text-white/20 cursor-not-allowed bg-black/40'
                                                : 'border-[#ff0055] text-white bg-[#ff0055] shadow-[3px_3px_0px_#ffea00] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer'
                                        }`}
                                        aria-label="Next Personel"
                                    >
                                        <ChevronRight className="w-6 h-6 stroke-[3]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Personel Cards Slider (Touch Swipe on Mobile & Responsive Sliding) */}
                        {memberList.length > 0 ? (
                            <div
                                className="overflow-hidden py-4 -mx-2 px-2 select-none"
                                onTouchStart={(e) => {
                                    setPersonelTouchEndX(null);
                                    setPersonelTouchStartX(e.targetTouches[0].clientX);
                                }}
                                onTouchMove={(e) => {
                                    setPersonelTouchEndX(e.targetTouches[0].clientX);
                                }}
                                onTouchEnd={handlePersonelTouchEnd}
                            >
                                <div
                                    className="flex"
                                    style={{
                                        gap: '20px',
                                        transform: `translateX(calc(-${personelIndex} * (100% + 20px) / ${personelItemsPerView}))`,
                                        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    }}
                                >
                                    {memberList.map((member, idx) => (
                                        <div
                                            key={member.id}
                                            className={`shrink-0 fade-up delay-${Math.min(idx + 1, 3)} ${personelInView ? 'visible' : ''}`}
                                            style={{
                                                width: `calc((100% - (${personelItemsPerView} - 1) * 20px) / ${personelItemsPerView})`,
                                                minWidth: `calc((100% - (${personelItemsPerView} - 1) * 20px) / ${personelItemsPerView})`,
                                            }}
                                        >
                                            <div className="bg-black/95 border-2 border-white/20 hover:border-[#ffea00] relative flex flex-col justify-between h-full shadow-[8px_8px_0px_#ff0055] hover:shadow-[10px_10px_0px_#ffea00] transition-all duration-300 group overflow-hidden">
                                                
                                                {/* Duct Tape Over Top Corner */}
                                                <div className="tape-strip absolute -top-3 -left-5 w-24 h-6 -rotate-12 z-30 pointer-events-none" />
                                                <div className="tape-strip absolute -bottom-3 -right-5 w-24 h-6 rotate-6 z-30 pointer-events-none" />

                                                {/* Card Header Tag */}
                                                <div className="p-4 sm:p-5 pb-3 flex justify-between items-start gap-2 border-b border-white/10 z-20 bg-neutral-950/70">
                                                    <div className="min-w-0">
                                                        <span className="font-mono-raw text-xs text-[#a3a3a3] uppercase tracking-wider block">
                                                            ROSTER // 0{idx + 1}
                                                        </span>
                                                        <h3 className="font-marker text-2xl sm:text-3xl text-white mt-1 group-hover:text-[#ffea00] transition-colors uppercase leading-none drop-shadow-[2px_2px_0px_#000] truncate">
                                                            {member.nama}
                                                        </h3>
                                                    </div>
                                                    <div className="bg-[#ffea00] text-black font-mono-raw font-black text-xs px-2.5 py-1 -rotate-2 shadow-[2px_2px_0px_#ff0055] uppercase shrink-0">
                                                        {member.posisi}
                                                    </div>
                                                </div>

                                                {/* Member Photo Frame */}
                                                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                                                    {member.image_url ? (
                                                        <img
                                                            src={member.image_url}
                                                            alt={member.nama}
                                                            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 filter"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white/40 p-4 text-center">
                                                            <Sparkles className="w-8 h-8 mb-2 text-[#ff0055]" />
                                                            <span className="font-marker text-lg">HOMESICK SUNDAY</span>
                                                        </div>
                                                    )}

                                                    {/* Half-tone dark gradient wash */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                                                    {/* Punk Stamp Badge */}
                                                    <div className="absolute bottom-3 right-3 bg-black/85 border border-white/20 px-2.5 py-1 font-mono-raw text-[10px] text-white">
                                                        ★ HOMESICK
                                                    </div>

                                                    {/* Member Position Badge bottom left */}
                                                    <div className="absolute bottom-3 left-3 bg-[#ff0055] text-white font-mono-raw font-black text-[11px] px-2.5 py-1 rotate-1 shadow-[2px_2px_0px_#000] uppercase">
                                                        {member.posisi}
                                                    </div>
                                                </div>

                                                {/* Bottom Card Footer */}
                                                <div className="p-4 sm:p-5 pt-4 bg-neutral-950/80 border-t border-white/10 z-20">
                                                    <div className="flex items-center justify-between font-mono-raw text-xs text-[#a3a3a3]">
                                                        <div className="flex items-center gap-1.5 text-white">
                                                            <Zap className="w-3.5 h-3.5 fill-[#ffea00] text-[#ffea00]" />
                                                            <span className="font-bold uppercase tracking-wider">HSS CORE</span>
                                                        </div>
                                                        <span className="text-[11px] text-[#ffea00] font-mono-raw font-bold">
                                                            LIVE & LOUD
                                                        </span>
                                                    </div>

                                                    {/* Barcode Strip */}
                                                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between font-mono-raw text-[9px] text-white/40">
                                                        <div className="tracking-[3px] font-black">||| || | |||| || | |</div>
                                                        <div>ID: HSS-MBR-0{member.id}</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed border-white/20 p-8 font-mono-raw text-white/50">
                                [NO PERSONEL ROSTER FOUND IN DATABASE]
                            </div>
                        )}

                        {/* Mobile Swipe Guidance & Pagination Dots */}
                        {personelMaxIndex > 0 && (
                            <div className="flex flex-col items-center justify-center gap-3 mt-8">
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: personelMaxIndex + 1 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPersonelIndex(i)}
                                            className={`h-2 transition-all duration-300 rounded-none border border-black ${
                                                personelIndex === i 
                                                    ? 'w-8 bg-[#ffea00] shadow-[2px_2px_0px_#ff0055]' 
                                                    : 'w-3 bg-white/30 hover:bg-white/50'
                                            }`}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex sm:hidden items-center justify-center gap-2 text-[#a3a3a3] font-mono-raw text-xs tracking-wider">
                                    <span>← SWIPE TO EXPLORE →</span>
                                </div>
                            </div>
                        )}

                    </div>
                    </section>

                    {/* ========================================================================= */}
                    {/* PHASE 2: ORIGINALS SECTION (DATA FROM TABLE ORIGINALS + MOBILE SWIPE) */}
                    {/* ========================================================================= */}
                    <section id="originals" ref={originalsRef} className="relative py-20 my-12 scroll-mt-24">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                            
                            {/* Section Header: Title & Slider Controls */}
                            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 mb-16 fade-up ${originalsInView ? 'visible' : ''}`}>
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 bg-[#ffea00] text-black font-mono-raw font-black text-xs px-3.5 py-1 uppercase shadow-[3px_3px_0px_#ff0055] -rotate-1 mb-3">
                                        <Music2 className="w-3.5 h-3.5 fill-black" />
                                        <span>OUR DISCOGRAPHY // RELEASES</span>
                                    </div>
                                    <h2 className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 leading-none">
                                        <span className="font-grindy text-5xl sm:text-7xl lg:text-8xl text-[#ff0055] drop-shadow-[4px_4px_0px_#000]">
                                            ORIGINAL
                                        </span>
                                        <span className="font-airone text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase font-sans">
                                            TRACKS
                                        </span>
                                    </h2>
                                    <p className="text-[#a3a3a3] text-sm sm:text-base font-mono-raw mt-2 max-w-lg">
                                        Turn up the volume. Stream our original releases straight from the underground.
                                    </p>
                                </div>

                                {/* Slider Navigation Controls */}
                                {originalsList.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setOriginalsIndex(Math.max(0, originalsIndex - 1))}
                                            disabled={originalsIndex === 0}
                                            className={`w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 ${
                                                originalsIndex === 0
                                                    ? 'border-white/10 text-white/20 cursor-not-allowed bg-black/40'
                                                    : 'border-[#ffea00] text-black bg-[#ffea00] shadow-[3px_3px_0px_#ff0055] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer'
                                            }`}
                                            aria-label="Previous Track"
                                        >
                                            <ChevronLeft className="w-6 h-6 stroke-[3]" />
                                        </button>
                                        <button
                                            onClick={() => setOriginalsIndex(Math.min(originalsMaxIndex, originalsIndex + 1))}
                                            disabled={originalsIndex >= originalsMaxIndex}
                                            className={`w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 ${
                                                originalsIndex >= originalsMaxIndex
                                                    ? 'border-white/10 text-white/20 cursor-not-allowed bg-black/40'
                                                    : 'border-[#ff0055] text-white bg-[#ff0055] shadow-[3px_3px_0px_#ffea00] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer'
                                            }`}
                                            aria-label="Next Track"
                                        >
                                            <ChevronRight className="w-6 h-6 stroke-[3]" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Originals Cards Slider (Touch Swipe on Mobile & Responsive Sliding) */}
                            {originalsList.length > 0 ? (
                                <div
                                    className="overflow-hidden py-4 -mx-2 px-2 select-none"
                                    onTouchStart={(e) => {
                                        setOriginalsTouchEndX(null);
                                        setOriginalsTouchStartX(e.targetTouches[0].clientX);
                                    }}
                                    onTouchMove={(e) => {
                                        setOriginalsTouchEndX(e.targetTouches[0].clientX);
                                    }}
                                    onTouchEnd={handleOriginalsTouchEnd}
                                >
                                    <div
                                        className="flex"
                                        style={{
                                            gap: '24px',
                                            transform: `translateX(calc(-${originalsIndex} * (100% + 24px) / ${originalsItemsPerView}))`,
                                            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        }}
                                    >
                                        {originalsList.map((track, idx) => (
                                            <div
                                                key={track.id}
                                                className={`shrink-0 fade-up delay-${Math.min(idx + 1, 3)} ${originalsInView ? 'visible' : ''}`}
                                                style={{
                                                    width: `calc((100% - (${originalsItemsPerView} - 1) * 24px) / ${originalsItemsPerView})`,
                                                    minWidth: `calc((100% - (${originalsItemsPerView} - 1) * 24px) / ${originalsItemsPerView})`,
                                                }}
                                            >
                                                <div className="bg-black/95 border-2 border-white/20 hover:border-[#ffea00] relative flex flex-col justify-between h-full shadow-[8px_8px_0px_#ff0055] hover:shadow-[10px_10px_0px_#ffea00] transition-all duration-300 group overflow-hidden">
                                                    
                                                    {/* Duct Tape Over Top Corner */}
                                                    <div className="tape-strip absolute -top-3 -left-5 w-24 h-6 -rotate-12 z-30 pointer-events-none" />
                                                    <div className="tape-strip absolute -bottom-3 -right-5 w-24 h-6 rotate-6 z-30 pointer-events-none" />

                                                    {/* Track Header Details */}
                                                    <div className="p-5 pb-3 flex justify-between items-start border-b border-white/10 z-20 bg-neutral-950/70">
                                                        <div>
                                                            <span className="font-mono-raw text-xs text-[#a3a3a3] uppercase tracking-wider block">
                                                                TRACK // 0{idx + 1}
                                                            </span>
                                                            <h3 className="font-marker text-2xl sm:text-3xl text-white mt-1 group-hover:text-[#ffea00] transition-colors uppercase leading-none drop-shadow-[2px_2px_0px_#000]">
                                                                {track.judul}
                                                            </h3>
                                                        </div>
                                                        <div className="bg-[#ffea00] text-black font-mono-raw font-black text-xs px-2.5 py-1 -rotate-2 shadow-[2px_2px_0px_#ff0055] uppercase">
                                                            ORIGINAL
                                                        </div>
                                                    </div>

                                                    {/* Cover Art Artwork Frame */}
                                                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                                                        {getTrackArtwork(track) ? (
                                                            <img
                                                                src={getTrackArtwork(track)!}
                                                                alt={track.judul}
                                                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 filter"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white/40 p-4 text-center">
                                                                <Music2 className="w-12 h-12 mb-2 text-[#ffea00]" />
                                                                <span className="font-marker text-xl">{track.judul}</span>
                                                            </div>
                                                        )}

                                                        {/* Dark Half-tone Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                                                        {/* Stamp Badge */}
                                                        <div className="absolute bottom-3 right-3 bg-black/85 border border-white/20 px-2.5 py-1 font-mono-raw text-[10px] text-white">
                                                            ★ HOMESICK SUNDAY
                                                        </div>

                                                        {/* Vinyl Tag Overlay */}
                                                        <div className="absolute top-3 right-3 bg-[#ff0055] text-white font-mono-raw font-black text-[10px] px-2 py-0.5 rotate-2 shadow-[2px_2px_0px_#000] uppercase">
                                                            OFFICIAL AUDIO
                                                        </div>
                                                    </div>

                                                    {/* Bottom Card Footer: Spotify Link & Barcode */}
                                                    <div className="p-5 pt-4 bg-neutral-950/80 border-t border-white/10 z-20">
                                                        <div className="flex items-center justify-between font-mono-raw text-xs text-[#a3a3a3]">
                                                            <div className="flex items-center gap-1.5 text-white">
                                                                <Zap className="w-3.5 h-3.5 fill-[#ffea00] text-[#ffea00]" />
                                                                <span className="font-bold uppercase tracking-wider">POP PUNK RAW</span>
                                                            </div>
                                                            <span className="text-[11px] text-[#ffea00] font-mono-raw font-bold">
                                                                STUDIO RECORD
                                                            </span>
                                                        </div>

                                                        {/* Stream Buttons */}
                                                        <div className="mt-4 flex flex-col gap-2">
                                                            {track.link_spotify && (
                                                                <a
                                                                    href={track.link_spotify}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono-raw font-black text-xs px-4 py-2.5 uppercase shadow-[3px_3px_0px_#000] inline-flex items-center justify-between w-full transition-all hover:-translate-y-0.5"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <SpotifyIcon className="w-4 h-4 fill-black" />
                                                                        <span>LISTEN ON SPOTIFY</span>
                                                                    </span>
                                                                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                                                </a>
                                                            )}
                                                            {track.link_apple_music && (
                                                                <a
                                                                    href={track.link_apple_music}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-[#fa233b] hover:bg-[#fc3c44] text-white font-mono-raw font-black text-xs px-4 py-2.5 uppercase shadow-[3px_3px_0px_#000] inline-flex items-center justify-between w-full transition-all hover:-translate-y-0.5"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <AppleMusicIcon className="w-4 h-4 fill-white" />
                                                                        <span>LISTEN ON APPLE MUSIC</span>
                                                                    </span>
                                                                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                                                </a>
                                                            )}
                                                            {!track.link_spotify && !track.link_apple_music && (
                                                                <div className="bg-white/10 text-[#a3a3a3] font-mono-raw text-xs px-4 py-2.5 uppercase text-center border border-white/10">
                                                                    COMING SOON ON STREAMING
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Barcode Strip */}
                                                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between font-mono-raw text-[9px] text-white/40">
                                                            <div className="tracking-[3px] font-black">||| || | |||| || | |</div>
                                                            <div>ID: HSS-TRK-0{track.id}</div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 border-2 border-dashed border-white/20 p-8 font-mono-raw text-white/50">
                                    [NO ORIGINAL TRACKS FOUND IN DATABASE]
                                </div>
                            )}

                            {/* Mobile Swipe Guidance & Pagination Dots */}
                            {originalsMaxIndex > 0 && (
                                <div className="flex flex-col items-center justify-center gap-3 mt-8">
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: originalsMaxIndex + 1 }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setOriginalsIndex(i)}
                                                className={`h-2 transition-all duration-300 rounded-none border border-black ${
                                                    originalsIndex === i 
                                                        ? 'w-8 bg-[#ffea00] shadow-[2px_2px_0px_#ff0055]' 
                                                    : 'w-3 bg-white/30 hover:bg-white/50'
                                                }`}
                                                aria-label={`Go to slide ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex sm:hidden items-center justify-center gap-2 text-[#a3a3a3] font-mono-raw text-xs tracking-wider">
                                        <span>← SWIPE TO EXPLORE →</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </section>


                    {/* ========================================================================= */}
                    {/* PHASE 5: FOOTER & CONTACT / TRANSMISSION HUB */}
                    {/* ========================================================================= */}
                    <footer id="subscribe" ref={subscribeRef} className={`relative bg-black pt-24 pb-16 torn-edge-top border-t border-white/15 scroll-mt-24 fade-up ${subscribeInView ? 'visible' : ''}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 border-b border-white/15">
                                
                                {/* Left Column: Brand Name & About Description */}
                                <div className="lg:col-span-6 space-y-6">
                                    <div className="inline-block bg-[#ffea00] text-black font-mono-raw font-black text-xs px-3 py-1 uppercase -rotate-2 shadow-[2px_2px_0px_#000]">
                                        ⚡ OFFICIAL TRANSMISSION // DIRECT CONTACT
                                    </div>
                                    
                                    <div>
                                        {(() => {
                                            const name = appSettings?.app_name || 'HOMESICK SUNDAY';
                                            const words = name.trim().split(/\s+/);
                                            if (words.length > 1) {
                                                const firstPart = words[0];
                                                const secondPart = words.slice(1).join(' ');
                                                return (
                                                    <h2 className="font-grindy text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] text-[#ff0055] drop-shadow-[4px_4px_0px_#ffea00] uppercase flex flex-col gap-1 sm:gap-2">
                                                        <span>{firstPart}</span>
                                                        <span>{secondPart}</span>
                                                    </h2>
                                                );
                                            }
                                            return (
                                                <h2 className="font-grindy text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] text-[#ff0055] drop-shadow-[4px_4px_0px_#ffea00] uppercase">
                                                    {name}
                                                </h2>
                                            );
                                        })()}
                                    </div>

                                    {aboutSection?.description && (
                                        <p className="text-[#a3a3a3] font-mono-raw text-sm sm:text-base leading-relaxed max-w-lg whitespace-pre-line">
                                            {aboutSection.description}
                                        </p>
                                    )}

                                    {/* Edgy Y2K Band Tag Stamp */}
                                    <div className="pt-2 flex flex-wrap items-center gap-3">
                                        <div className="inline-block bg-white text-black font-mono-raw font-black text-[11px] px-3 py-1 border-2 border-dashed border-black rotate-1 shadow-[2px_2px_0px_#ff0055] uppercase">
                                            POP PUNK REBEL
                                        </div>
                                        <div className="inline-block bg-black text-[#ffea00] border-2 border-[#ffea00] font-mono-raw font-black text-[11px] px-3 py-1 -rotate-2 shadow-[2px_2px_0px_#000] uppercase">
                                            YOGYAKARTA // ID
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Direct Contact Info & Socials from app_settings */}
                                <div className="lg:col-span-6">
                                    <div className="bg-black/80 border-2 border-white/20 p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_#ff0055] relative backdrop-blur-sm space-y-6">
                                        
                                        <div className="tape-strip absolute -top-4 right-10 w-28 h-6 rotate-[-2deg]" />

                                        {/* Card Header */}
                                        <div className="border-b border-white/15 pb-4 flex items-center justify-between">
                                            <span className="font-mono-raw text-xs text-[#ffea00] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Radio className="w-4 h-4 text-[#ffea00]" />
                                                COMMUNICATION LINES // CONNECT
                                            </span>
                                            <span className="font-mono-raw text-[10px] text-[#ffea00] bg-white/5 border border-white/15 px-2 py-0.5 uppercase font-bold">
                                                LIVE CHANNEL
                                            </span>
                                        </div>

                                        {/* 01: Email */}
                                        <div className="space-y-2">
                                            <label className="block font-mono-raw text-xs text-[#ffea00] font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-[#ff0055]" />
                                                <span>01 // TRANSMISSION EMAIL</span>
                                            </label>
                                            {appSettings?.email ? (
                                                <a 
                                                    href={`mailto:${appSettings.email}`}
                                                    className="w-full bg-neutral-900/90 hover:bg-neutral-800 border-b-4 border-white hover:border-[#ff0055] px-4 py-3 text-white hover:text-[#ffea00] text-base sm:text-lg font-mono-raw font-bold transition-all break-all flex items-center justify-between group"
                                                >
                                                    <span>{appSettings.email}</span>
                                                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#ff0055] transition-colors shrink-0" />
                                                </a>
                                            ) : (
                                                <div className="w-full bg-neutral-900/50 border-b-4 border-white/20 px-4 py-3 text-neutral-500 font-mono-raw text-sm">
                                                    NO EMAIL SPECIFIED
                                                </div>
                                            )}
                                        </div>

                                        {/* 02: Phone Number */}
                                        <div className="space-y-2">
                                            <label className="block font-mono-raw text-xs text-[#ffea00] font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-[#ff0055]" />
                                                <span>02 // HOTLINE & BOOKING</span>
                                            </label>
                                            {appSettings?.phone_number ? (
                                                <a 
                                                    href={`tel:${appSettings.phone_number.replace(/\s+/g, '')}`}
                                                    className="w-full bg-neutral-900/90 hover:bg-neutral-800 border-b-4 border-white hover:border-[#ff0055] px-4 py-3 text-white hover:text-[#ffea00] text-base sm:text-lg font-mono-raw font-bold transition-all flex items-center justify-between group"
                                                >
                                                    <span>{appSettings.phone_number}</span>
                                                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#ff0055] transition-colors shrink-0" />
                                                </a>
                                            ) : (
                                                <div className="w-full bg-neutral-900/50 border-b-4 border-white/20 px-4 py-3 text-neutral-500 font-mono-raw text-sm">
                                                    NO PHONE SPECIFIED
                                                </div>
                                            )}
                                        </div>

                                        {/* 03: Social Channels (Instagram, TikTok, YouTube) */}
                                        <div className="space-y-2.5 pt-2">
                                            <label className="block font-mono-raw text-xs text-[#ffea00] font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-[#ff0055]" />
                                                <span>03 // SOCIAL BROADCAST NETWORKS</span>
                                            </label>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {/* Instagram */}
                                                {appSettings?.instagram_url ? (
                                                    <a 
                                                        href={appSettings.instagram_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-black hover:bg-[#ff0055] text-white border-2 border-white/30 hover:border-black p-3 font-mono-raw font-bold text-xs uppercase shadow-[3px_3px_0px_#ff0055] hover:shadow-[3px_3px_0px_#ffea00] transition-all flex items-center justify-between group -rotate-1 hover:rotate-0"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <Instagram className="w-4 h-4 text-[#ff0055] group-hover:text-white shrink-0" />
                                                            <span>INSTAGRAM</span>
                                                        </span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <div className="bg-neutral-950 border border-white/10 p-3 font-mono-raw text-[11px] text-neutral-500 uppercase flex items-center gap-2">
                                                        <Instagram className="w-4 h-4 text-neutral-600 shrink-0" />
                                                        <span>INSTAGRAM</span>
                                                    </div>
                                                )}

                                                {/* TikTok */}
                                                {appSettings?.tiktok_url ? (
                                                    <a 
                                                        href={appSettings.tiktok_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-black hover:bg-white hover:text-black text-white border-2 border-white/30 hover:border-black p-3 font-mono-raw font-bold text-xs uppercase shadow-[3px_3px_0px_#00f2fe] hover:shadow-[3px_3px_0px_#ff0055] transition-all flex items-center justify-between group rotate-1 hover:rotate-0"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <TikTokIcon className="w-4 h-4 text-[#00f2fe] group-hover:text-black shrink-0" />
                                                            <span>TIKTOK</span>
                                                        </span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <div className="bg-neutral-950 border border-white/10 p-3 font-mono-raw text-[11px] text-neutral-500 uppercase flex items-center gap-2">
                                                        <TikTokIcon className="w-4 h-4 text-neutral-600 shrink-0" />
                                                        <span>TIKTOK</span>
                                                    </div>
                                                )}

                                                {/* YouTube */}
                                                {appSettings?.youtube_url ? (
                                                    <a 
                                                        href={appSettings.youtube_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-black hover:bg-[#ff0000] text-white border-2 border-white/30 hover:border-black p-3 font-mono-raw font-bold text-xs uppercase shadow-[3px_3px_0px_#ffea00] hover:shadow-[3px_3px_0px_#000] transition-all flex items-center justify-between group -rotate-1 hover:rotate-0"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <Youtube className="w-4 h-4 text-[#ffea00] group-hover:text-white shrink-0" />
                                                            <span>YOUTUBE</span>
                                                        </span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <div className="bg-neutral-950 border border-white/10 p-3 font-mono-raw text-[11px] text-neutral-500 uppercase flex items-center gap-2">
                                                        <Youtube className="w-4 h-4 text-neutral-600 shrink-0" />
                                                        <span>YOUTUBE</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Barcode Accent */}
                                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono-raw text-neutral-500">
                                            <span>TRANSMISSION HUB ID: HSS-COMM-01</span>
                                            <span className="tracking-[2px] font-bold text-neutral-400">||| | |||| || | ||</span>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* Bottom Footer Credits & Barcode Aesthetic */}
                            <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono-raw text-xs text-[#a3a3a3]">
                                <div className="flex items-center gap-4">
                                    <span className="text-[#ffea00] font-black">{appSettings?.app_name?.toUpperCase() || 'HOMESICK SUNDAY'} // EST. 2026</span>
                                    <span>•</span>
                                    <span>ALL RIGHTS RESERVED</span>
                                </div>

                            </div>

                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
}
