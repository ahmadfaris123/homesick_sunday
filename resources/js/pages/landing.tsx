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
};

export default function Landing() {
    const { appSettings, aboutSection, heroSlides, personel } = usePage<SharedProps>().props;
    const logoUrl = appSettings?.logo_url;
    const heroBgImage = heroSlides?.[0]?.image_url ?? '/assets/DSC09533.jpg';

    // Fallback personel jika database kosong
    const DEFAULT_PERSONEL = [
        { id: 1, nama: 'Member 1', posisi: 'Vocalist', image_url: 'https://i.pravatar.cc/300?img=21' },
        { id: 2, nama: 'Member 2', posisi: 'Guitarist', image_url: 'https://i.pravatar.cc/300?img=22' },
        { id: 3, nama: 'Member 3', posisi: 'Bassist', image_url: 'https://i.pravatar.cc/300?img=23' },
        { id: 4, nama: 'Member 4', posisi: 'Drummer', image_url: 'https://i.pravatar.cc/300?img=24' },
    ];
    const memberList = (personel && personel.length > 0) ? personel : DEFAULT_PERSONEL;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const whoIsRef = useRef<HTMLDivElement>(null);
    const [paperTorn, setPaperTorn] = useState(false);

    const aboutRef = useRef<HTMLElement>(null);
    const [aboutVisible, setAboutVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setPaperTorn(true), 200);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 }
        );
        if (whoIsRef.current) observer.observe(whoIsRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setAboutVisible(true), 100);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (aboutRef.current) observer.observe(aboutRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head>
                <title>Homesick Sunday</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {logoUrl && (
                    <link rel="icon" type="image/png" href={logoUrl} />
                )}
            </Head>

            <div className="bg-black text-white min-h-screen font-['Airone',sans-serif] overflow-hidden">
                {/* Hero Section */}
                <section className="relative w-full h-screen flex flex-col items-center justify-start overflow-hidden">
                    {/* Background Image with grayscale/overlay */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={heroBgImage}
                            alt="Band Background" 
                            className="w-full h-full object-cover opacity-50 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90"></div>
                    </div>

                    {/* Navbar */}
                    <nav className="relative z-20 hidden md:flex justify-center space-x-12 pt-8 font-bold text-sm tracking-widest uppercase">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-yellow-400 transition cursor-pointer">Home</button>
                        <button onClick={() => scrollTo('about')} className="hover:text-yellow-400 transition cursor-pointer">About</button>
                        <button onClick={() => scrollTo('who-is')} className="hover:text-yellow-400 transition cursor-pointer">Personnel</button>
                        <button onClick={() => scrollTo('our-originals')} className="hover:text-yellow-400 transition cursor-pointer">Originals</button>
                    </nav>

                    {/* Hero Title */}
                    <div className="relative z-20 flex flex-col items-center mt-32">
                        <h1 className="text-6xl md:text-8xl font-['Grindy_Brush'] text-[#FFC700] tracking-tighter leading-none text-white drop-shadow-lg text-center uppercase">
                            Homesick
                        </h1>
                        <h2 className="text-6xl md:text-8xl font-['Grindy_Brush'] text-[#FFC700] transform -rotate-3 -mt-6 drop-shadow-lg text-center">
                            Sunday
                        </h2>
                    </div>

                    {/* Dummy Cutout Members */}
                    <div className="absolute left-0 md:left-0 bottom-[130px] z-10 hidden md:block -translate-x-[50px]">
                        <img src="/assets/surip.png" alt="Surip" className="w-48 h-64 object-cover object-top transform -rotate-6" />
                    </div>
                    <div className="absolute right-0 md:right-0 bottom-[120px] z-10 hidden md:block">
                        <img src="/assets/andika.png" alt="Andika" className="w-48 h-64 object-cover object-top transform rotate-6 scale-x-[-1]" />
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-20 z-20 flex justify-center w-full">
                        <div className="w-[2px] h-12 bg-yellow-400 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-ping"></div>
                        </div>
                    </div>

                    {/* Bottom Paper Edge */}
                    <div className="absolute bottom-0 w-full z-30 translate-y-[40px]">
                        <img src="/assets/paper-bottom.png" className="w-full object-cover object-top" alt="Paper Bottom Edge" />
                    </div>
                </section>

                {/* About Section */}
                {aboutSection?.active !== false && (
                    <section ref={aboutRef} id="about" className="relative w-full py-32 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-16 overflow-hidden">

                        {/* Background grid */}
                        {/* <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/assets/white-grid.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} /> */}

                        {/* punk-1.png — pojok kanan atas, slide masuk dari kanan */}
                        {/* <img
                            src="/assets/punk-1.png"
                            alt="Punk 1"
                            className="absolute top-0 right-0 w-16 md:w-22 pointer-events-none select-none z-10"
                            style={{
                                transform: aboutVisible ? 'translateX(0)' : 'translateX(120%)',
                                transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            }}
                        /> */}

                        {/* punk-2.png — pojok kiri bawah, slide masuk dari kiri */}
                        {/* <img
                            src="/assets/punk-2.png"
                            alt="Punk 2"
                            className="absolute bottom-0 left-0 w-16 md:w-22 pointer-events-none select-none z-10"
                            style={{
                                transform: aboutVisible ? 'translateX(0)' : 'translateX(-120%)',
                                transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s',
                            }}
                        /> */}

                        {/* Left: Group Photo */}
                        <div className="w-full md:w-1/2 flex justify-center relative z-20">
                            <img 
                                src={aboutSection?.image_url || "/assets/group.png"} 
                                alt="Group" 
                                className="w-3/4 max-w-sm rounded-xl transform -rotate-3 object-cover shadow-2xl"
                            />
                        </div>
                        {/* Right: Text */}
                        <div className="w-full md:w-1/2 max-w-lg relative z-20">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-2">
                                {aboutSection?.title || 'About'}
                            </h3>
                            <h4 className="text-4xl md:text-5xl flex gap-3 mb-6">
                                <span className="font-['Grindy_Brush'] italic tracking-tighter uppercase">Homesick</span>
                                <span className="font-['Grindy_Brush'] text-[#FFC700] -rotate-3 mt-1">Sunday</span>
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed tracking-wide font-medium whitespace-pre-line">
                                {aboutSection?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}
                            </p>
                        </div>
                    </section>
                )}

                {/* Who Is Section */}
                <section id="who-is" className="relative w-full flex flex-col items-center">
                    <div className="pb-16 text-center z-10 relative">
                        <h3 className="text-2xl font-black uppercase tracking-widest mb-2">Who is</h3>
                        <h4 className="text-4xl md:text-5xl flex gap-3 justify-center">
                            <span className="font-['Grindy_Brush'] italic tracking-tighter uppercase">Homesick</span>
                            <span className="font-['Grindy_Brush'] text-[#FFC700] -rotate-3 mt-1">Sunday</span>
                        </h4>
                    </div>

                    {/* Paper background section */}
                    <div ref={whoIsRef} className="relative w-full py-32 overflow-hidden">
                        {/* Paper top decoration */}
                        <div className="absolute left-0 w-full z-20" style={{ top: '-150px' }}>
                            <img src="/assets/paper-top.png" className="w-full" alt="Paper Top" />
                        </div>

                        {/* Background texture wrapper */}
                        <div className="absolute inset-0 z-0 bg-white bg-cover bg-center" style={{
                            backgroundImage: "url('/assets/images-kertas.jpeg')"
                        }}></div>

                        {/* Paper bottom decoration */}
                        <div className="absolute left-0 w-full z-10" style={{ bottom: '-150px' }}>
                            <img src="/assets/paper-bottom.png" className="w-full" alt="Paper Bottom" />
                        </div>

                        {/* Top torn edge (black) - dekoratif */}
                        <div className="absolute top-0 w-full z-10 transform -translate-y-[99%] text-black rotate-180">
                            <img src="/assets/pngtree-white-torn-paper-strips-with-cutout-edges-png-image_16485356.png" className="w-full h-16 object-cover object-bottom" alt="Torn Paper Edge" />
                        </div>

                        {/* === Black Overlay (slides right → left → content revealed) === */}
                        <div
                            className="absolute inset-0 z-30 pointer-events-none bg-black"
                            style={{
                                transform: paperTorn ? 'translateX(-110%)' : 'translateX(0)',
                                transition: 'transform 1.8s cubic-bezier(0.55, 0, 0.1, 1)',
                            }}
                        />

                        {/* Member Cards */}
                        <div
                            className="relative z-20 flex flex-wrap justify-center gap-6 md:gap-12 px-6"
                            style={{
                                opacity: paperTorn ? 1 : 0,
                                transform: paperTorn ? 'translateX(0)' : 'translateX(40px)',
                                transition: 'opacity 0.7s ease 0.9s, transform 0.7s ease 0.9s',
                            }}
                        >
                            {memberList.map((member) => (
                                <div key={member.id} className="w-40 md:w-52 bg-black rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                                    <div className="w-full h-56 md:h-72 overflow-hidden">
                                        <img
                                            src={member.image_url ?? 'https://i.pravatar.cc/300?img=21'}
                                            alt={member.nama}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    </div>
                                    <div className="px-3 py-2 text-left">
                                        <p className="text-white font-['Grindy_Brush'] text-sm leading-tight truncate">{member.nama}</p>
                                        <p className="text-yellow-400 text-xs mt-0.5 truncate">{member.posisi}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom torn edge (black) */}
                        <div className="absolute bottom-0 w-full z-10 transform translate-y-[99%] text-black">
                            <img src="/assets/pngtree-white-torn-paper-strips-with-cutout-edges-png-image_16485356.png" className="w-full h-16 object-cover object-top" alt="Torn Paper Edge" />
                        </div>
                    </div>
                </section>

                {/* Our Originals Section */}
                <section id="our-originals" className="relative w-full py-40 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-16">Our Originals</h3>
                    
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-6xl md:text-8xl font-['Grindy_Brush'] transform -rotate-3 text-white">
                            STAY
                        </span>
                        <span className="text-6xl md:text-8xl font-['Grindy_Brush'] transform -rotate-3 text-[#FFC700]">
                            TUNE
                        </span>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full py-16 px-10 md:px-24 flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-4xl flex flex-col items-start gap-0">
                            <span className="font-['Grindy_Brush'] italic tracking-tighter uppercase">Homesick</span>
                            <span className="font-['Grindy_Brush'] text-[#FFC700] -rotate-3">Sunday</span>
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm font-bold tracking-wider uppercase text-gray-400">
                        <a href="#top" className="hover:text-white transition">Home</a>
                        <a href={appSettings?.email ? `mailto:${appSettings.email}` : '#contact'} className="hover:text-white transition">Email</a>
                        <a href="#about" className="hover:text-white transition">About</a>
                        <a href={appSettings?.phone_number ? `https://wa.me/${appSettings.phone_number}` : '#contact'} className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Whatsapp</a>
                        <a href="#personels" className="hover:text-white transition">Personels</a>
                        <a href={appSettings?.instagram_url || '#contact'} className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="#our-originals" className="hover:text-white transition">Originals</a>
                        <a href={appSettings?.youtube_url || '#contact'} className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Youtube</a>
                    </div>
                </footer>
            </div>
        </>
    );
}
