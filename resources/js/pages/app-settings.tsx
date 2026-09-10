import { useForm, usePage, Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Settings,
    Upload,
    X,
    ImageIcon,
    Building2,
    Mail,
    Phone,
    Instagram,
    Youtube,
    Save,
    Globe,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppSettingController from '@/actions/App/Http/Controllers/AppSettingController';

// TikTok icon (not in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
    );
}

type AppSettings = {
    id: number;
    logo_url: string | null;
    app_name: string;
    email: string | null;
    phone_number: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    youtube_url: string | null;
    latest_video_url: string | null;
};

type PageProps = {
    settings: AppSettings;
};

export default function AppSettings() {
    const { settings } = usePage<PageProps>().props;

    const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo_url);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        logo: null as File | null,
        logo_remove: false as boolean,
        app_name: settings.app_name ?? '',
        email: settings.email ?? '',
        phone_number: settings.phone_number ?? '',
        instagram_url: settings.instagram_url ?? '',
        tiktok_url: settings.tiktok_url ?? '',
        youtube_url: settings.youtube_url ?? '',
        latest_video_url: settings.latest_video_url ?? '',
    });

    function handleLogoChange(file: File | null) {
        if (!file) return;
        setData('logo', file);
        setData('logo_remove', false);
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    function handleRemoveLogo() {
        setLogoPreview(null);
        setData('logo', null);
        setData('logo_remove', true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleLogoChange(file);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(AppSettingController.update.url(), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    const socialFields = [
        {
            key: 'instagram_url' as const,
            label: 'Instagram URL',
            placeholder: 'https://instagram.com/youraccount',
            icon: Instagram,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
        },
        {
            key: 'tiktok_url' as const,
            label: 'TikTok URL',
            placeholder: 'https://tiktok.com/@youraccount',
            icon: TikTokIcon,
            color: 'text-slate-700 dark:text-slate-200',
            bg: 'bg-slate-500/10',
        },
        {
            key: 'youtube_url' as const,
            label: 'YouTube URL',
            placeholder: 'https://youtube.com/@yourchannel',
            icon: Youtube,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
    ];

    return (
        <>
            <Head title="Settings Aplikasi" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                        <Settings className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Settings Aplikasi</h1>
                        <p className="text-muted-foreground text-sm">Kelola identitas, kontak, dan media sosial aplikasi Anda.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* ── BRAND IDENTITY CARD ── */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
                                    <Building2 className="size-4 text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Brand Identity</p>
                                    <p className="text-xs text-muted-foreground">Logo & nama aplikasi</p>
                                </div>
                            </div>

                            <div className="space-y-6 p-6">
                                {/* Logo Upload */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Logo Aplikasi</Label>
                                    <p className="text-xs text-muted-foreground -mt-1">Digunakan di sidebar dan favicon. Format: JPG, PNG, SVG, WebP (maks. 2MB)</p>

                                    <div
                                        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer
                                            ${isDragging
                                                ? 'border-violet-500 bg-violet-500/5 scale-[1.01]'
                                                : 'border-sidebar-border/70 hover:border-violet-400 hover:bg-violet-500/5'
                                            }`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                                        aria-label="Upload logo aplikasi"
                                    >
                                        {logoPreview ? (
                                            <>
                                                <div className="relative">
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo preview"
                                                        className="size-24 rounded-xl object-cover ring-4 ring-violet-500/20 shadow-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveLogo(); }}
                                                        className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform"
                                                        aria-label="Hapus logo"
                                                    >
                                                        <X className="size-3.5" />
                                                    </button>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
                                                        Klik atau drop untuk ganti logo
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex size-14 items-center justify-center rounded-xl bg-violet-500/10">
                                                    <ImageIcon className="size-7 text-violet-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        <span className="text-violet-600 dark:text-violet-400">Klik untuk upload</span>{' '}
                                                        atau drag & drop
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, SVG, WebP hingga 2MB</p>
                                                </div>
                                                <div className="flex items-center gap-2 rounded-full border border-sidebar-border/50 px-3 py-1">
                                                    <Upload className="size-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Pilih File</span>
                                                </div>
                                            </>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            id="logo-input"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                                        />
                                    </div>
                                    <InputError message={errors.logo} />
                                </div>

                                {/* App Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="app_name" className="text-sm font-medium">
                                        Nama Brand <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="app_name"
                                            name="app_name"
                                            value={data.app_name}
                                            onChange={(e) => setData('app_name', e.target.value)}
                                            placeholder="Nama aplikasi / brand"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Digunakan sebagai judul halaman dan nama di sidebar</p>
                                    <InputError message={errors.app_name} />
                                </div>
                            </div>
                        </div>

                        {/* ── CONTACT INFO CARD ── */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                            <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Mail className="size-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Informasi Kontak</p>
                                    <p className="text-xs text-muted-foreground">Email & nomor telepon publik</p>
                                </div>
                            </div>

                            <div className="space-y-5 p-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="info@contoh.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number" className="text-sm font-medium">Nomor Telepon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="phone_number"
                                            type="tel"
                                            name="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.phone_number} />
                                </div>

                                {/* Preview Card */}
                                <div className="mt-4 rounded-xl border border-sidebar-border/50 bg-muted/30 p-4">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview Kontak</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="size-3.5 text-blue-500 shrink-0" />
                                            <span className={`truncate ${data.email ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                                                {data.email || 'Belum diisi'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="size-3.5 text-green-500 shrink-0" />
                                            <span className={`${data.phone_number ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                                                {data.phone_number || 'Belum diisi'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SOCIAL MEDIA CARD ── */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-red-500/10">
                                <Instagram className="size-4 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Media Sosial</p>
                                <p className="text-xs text-muted-foreground">Tautan ke akun media sosial resmi</p>
                            </div>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-3">
                            {socialFields.map(({ key, label, placeholder, icon: Icon, color, bg }) => (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={key} className="flex items-center gap-2 text-sm font-medium">
                                        <span className={`flex size-5 items-center justify-center rounded-md ${bg}`}>
                                            <Icon className={`size-3.5 ${color}`} />
                                        </span>
                                        {label}
                                    </Label>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center`}>
                                            <Icon className={`size-4 ${color}`} />
                                        </span>
                                        <Input
                                            id={key}
                                            name={key}
                                            type="url"
                                            value={data[key]}
                                            onChange={(e) => setData(key, e.target.value)}
                                            placeholder={placeholder}
                                            className="pl-10"
                                        />
                                    </div>
                                    {data[key] && (
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3 text-green-500" />
                                            <span className="text-xs text-green-600 dark:text-green-400 truncate">{data[key]}</span>
                                        </div>
                                    )}
                                    <InputError message={errors[key]} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── LATEST VIDEO CARD ── */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10">
                                <Youtube className="size-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Latest Video</p>
                                <p className="text-xs text-muted-foreground">Tautan ke video YouTube terbaru untuk ditampilkan di landing page</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="latest_video_url" className="flex items-center gap-2 text-sm font-medium">
                                    <span className="flex size-5 items-center justify-center rounded-md bg-red-500/10">
                                        <Youtube className="size-3.5 text-red-500" />
                                    </span>
                                    URL Latest Video (YouTube)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center">
                                        <Youtube className="size-4 text-red-500" />
                                    </span>
                                    <Input
                                        id="latest_video_url"
                                        name="latest_video_url"
                                        type="url"
                                        value={data.latest_video_url}
                                        onChange={(e) => setData('latest_video_url', e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.latest_video_url} />
                            </div>

                            {/* Thumbnail Preview */}
                            {data.latest_video_url && data.latest_video_url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/) && (
                                <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/50 bg-muted/20 p-3">
                                    <img
                                        src={`https://img.youtube.com/vi/${data.latest_video_url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]}/hqdefault.jpg`}
                                        alt="YouTube Thumbnail Preview"
                                        className="h-20 w-32 rounded-lg object-cover border border-sidebar-border/50"
                                    />
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="size-3.5" />
                                            Thumbnail YouTube terdeteksi
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Thumbnail ini akan ditampilkan di section Latest Video pada landing page.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── SAVE BUTTON ── */}
                    <div className="flex items-center justify-between rounded-2xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">
                            Perubahan akan langsung diterapkan setelah disimpan.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={processing}
                                id="reset-settings-button"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                                id="save-settings-button"
                            >
                                <Save className="size-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

AppSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings Aplikasi', href: '/app-settings' },
    ],
};
