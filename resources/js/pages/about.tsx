import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState, useCallback } from 'react';
import {
    Info,
    Upload,
    X,
    ImageIcon,
    FileText,
    Save,
    CheckCircle2,
    Loader2,
    Sparkles,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AboutController from '@/actions/App/Http/Controllers/AboutController';

// ─── Types ────────────────────────────────────────────────────────────────────

type AboutData = {
    id: number;
    image_url: string | null;
    title: string;
    description: string | null;
    active: boolean;
};

type PageProps = {
    about: AboutData;
};

// ─── Image compression utility ────────────────────────────────────────────────

async function compressImage(file: File, maxWidth = 1400, maxHeight = 1000, quality = 0.85): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) { resolve(file); return; }
                    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });
                    resolve(compressed);
                },
                'image/webp',
                quality,
            );
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
    });
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={[
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
                'transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                checked ? 'bg-emerald-500' : 'bg-muted',
            ].join(' ')}
        >
            <span
                className={[
                    'pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0',
                    'transition-transform duration-200 ease-in-out',
                    checked ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
            />
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
    const { about } = usePage<PageProps>().props;

    const [imagePreview, setImagePreview] = useState<string | null>(about.image_url);
    const [compressInfo, setCompressInfo] = useState<{ original: number; compressed: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
        image_remove: false as boolean,
        title: about.title ?? '',
        description: about.description ?? '',
        active: about.active ?? true,
    });

    const handleImageFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) return;
        setIsCompressing(true);
        const originalSize = file.size;
        const compressed = await compressImage(file);
        setIsCompressing(false);
        setCompressInfo({ original: originalSize, compressed: compressed.size });
        setData('image', compressed);
        setData('image_remove', false);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(compressed);
    }, [setData]);

    function handleRemoveImage() {
        setImagePreview(null);
        setCompressInfo(null);
        setData('image', null);
        setData('image_remove', true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(AboutController.update.url(), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="About" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/25">
                        <Info className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Konten About</h1>
                        <p className="text-muted-foreground text-sm">Kelola gambar, judul, dan deskripsi untuk section About di landing page.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* ── LEFT: IMAGE UPLOAD CARD ── */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10">
                                    <ImageIcon className="size-4 text-teal-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Gambar About</p>
                                    <p className="text-xs text-muted-foreground">Foto atau visual ilustrasi untuk section About</p>
                                </div>
                            </div>

                            <div className="space-y-6 p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Upload Gambar</Label>
                                        <span className="text-xs text-muted-foreground">Auto-kompres ke format WebP</span>
                                    </div>

                                    <div
                                        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer min-h-[260px]
                                            ${isDragging
                                                ? 'border-teal-500 bg-teal-500/5 scale-[1.01]'
                                                : 'border-sidebar-border/70 hover:border-teal-400 hover:bg-teal-500/5'
                                            }`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                                        aria-label="Upload gambar about"
                                    >
                                        {isCompressing ? (
                                            <div className="flex flex-col items-center gap-2 py-8">
                                                <Loader2 className="size-8 animate-spin text-teal-500" />
                                                <p className="text-sm font-medium text-foreground">Mengoptimalkan gambar...</p>
                                                <p className="text-xs text-muted-foreground">Mengompresi ke WebP resolusi tajam</p>
                                            </div>
                                        ) : imagePreview ? (
                                            <>
                                                <div className="relative w-full max-w-sm overflow-hidden rounded-xl">
                                                    <img
                                                        src={imagePreview}
                                                        alt="About preview"
                                                        className="h-52 w-full rounded-xl object-cover ring-4 ring-teal-500/20 shadow-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                                        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform"
                                                        aria-label="Hapus gambar"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                    {compressInfo && (
                                                        <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                                            {formatBytes(compressInfo.original)} → {formatBytes(compressInfo.compressed)}
                                                            {' '}
                                                            <span className="text-emerald-400 font-bold">
                                                                (-{Math.round((1 - compressInfo.compressed / compressInfo.original) * 100)}%)
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                                                        Klik atau drop file baru untuk mengganti gambar
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex size-14 items-center justify-center rounded-xl bg-teal-500/10">
                                                    <ImageIcon className="size-7 text-teal-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        <span className="text-teal-600 dark:text-teal-400">Klik untuk upload</span>{' '}
                                                        atau drag & drop
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP (otomatis dioptimasi)</p>
                                                </div>
                                                <div className="flex items-center gap-2 rounded-full border border-sidebar-border/50 px-3 py-1">
                                                    <Upload className="size-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Pilih File</span>
                                                </div>
                                            </>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            id="image-input"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageFile(file);
                                            }}
                                        />
                                    </div>
                                    <InputError message={errors.image} />
                                </div>

                                {/* Feature Tip */}
                                <div className="rounded-xl border border-sidebar-border/50 bg-muted/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="size-4 text-teal-500 shrink-0 mt-0.5" />
                                        <div className="text-xs text-muted-foreground leading-relaxed">
                                            <span className="font-semibold text-foreground">Optimasi Otomatis:</span> Setiap gambar yang diunggah dikonversi ke format WebP berkualitas tinggi dengan kompresi cerdas untuk mempercepat loading halaman landing.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: CONTENT INFO CARD ── */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border overflow-hidden">
                            <div className="flex items-center gap-3 border-b border-sidebar-border/50 bg-muted/30 px-6 py-4">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10">
                                    <FileText className="size-4 text-teal-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Teks Konten</p>
                                    <p className="text-xs text-muted-foreground">Judul, deskripsi, dan visibilitas section</p>
                                </div>
                            </div>

                            <div className="space-y-5 p-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        Judul Section <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Tentang Kami / Homesick Sunday"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tuliskan cerita, profil, atau latar belakang..."
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed"
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {data.description.length} karakter
                                    </p>
                                    <InputError message={errors.description} />
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-muted/20 px-4 py-3">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Status Tampilan</p>
                                        <p className="text-xs text-muted-foreground">Tampilkan section ini pada landing page</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold ${data.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                                            {data.active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <Toggle
                                            checked={data.active}
                                            onChange={(v) => setData('active', v)}
                                        />
                                    </div>
                                </div>

                                {/* Live Text Preview */}
                                <div className="rounded-xl border border-sidebar-border/50 bg-muted/30 p-4 space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Eye className="size-3.5 text-teal-500" />
                                        <span>Preview Konten</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-bold text-foreground">
                                            {data.title || <span className="italic text-muted-foreground">Judul belum diisi</span>}
                                        </p>
                                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                                            {data.description || <span className="italic text-muted-foreground/60">Deskripsi belum diisi</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SAVE BUTTON ── */}
                    <div className="flex items-center justify-between rounded-2xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="size-4 text-teal-500" />
                            <span>Perubahan akan langsung diterapkan setelah disimpan.</span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setImagePreview(about.image_url);
                                    setCompressInfo(null);
                                }}
                                disabled={processing || isCompressing}
                                id="reset-about-button"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || isCompressing}
                                className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40"
                                id="save-about-button"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Simpan Konten
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

About.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'About', href: '/about' },
    ],
};
