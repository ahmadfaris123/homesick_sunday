import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    ImageIcon,
    X,
    AlertTriangle,
    Upload,
    Loader2,
    Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

// ─── Spotify Icon Component ───────────────────────────────────────────────────

function SpotifyIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.62-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
        </svg>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type OriginalItem = {
    id: number;
    image_url: string | null;
    judul: string;
    link_spotify: string | null;
    active: boolean;
};

type PageProps = {
    originals: OriginalItem[];
};

// ─── Image compression utility ────────────────────────────────────────────────

async function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.82): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;

            // Only resize if bigger than max dimensions
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

// ─── Spotify utility ──────────────────────────────────────────────────────────

function isValidSpotifyUrl(url: string): boolean {
    if (!url) return false;
    return /https?:\/\/(open|play)\.spotify\.com\/(intl-[a-zA-Z]{2,3}\/)?(track|album|playlist|artist|episode|show)\/[a-zA-Z0-9]+/.test(url);
}

async function fetchSpotifyArtwork(spotifyUrl: string): Promise<File | null> {
    try {
        const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`;
        const res = await fetch(oembedUrl);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.thumbnail_url) return null;

        const imgRes = await fetch(data.thumbnail_url);
        if (!imgRes.ok) return null;
        const blob = await imgRes.blob();
        return new File([blob], `spotify-artwork-${Date.now()}.jpg`, { type: 'image/jpeg' });
    } catch {
        return null;
    }
}

// ─── Toggle Component ─────────────────────────────────────────────────────────

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

// ─── Originals Form Modal ─────────────────────────────────────────────────────

type OriginalFormProps = {
    open: boolean;
    onClose: () => void;
    item?: OriginalItem | null;
};

function OriginalFormModal({ open, onClose, item }: OriginalFormProps) {
    const isEdit = !!item;

    const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
    const [imageRemove, setImageRemove] = useState(false);
    const [compressInfo, setCompressInfo] = useState<{ original: number; compressed: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isFetchingSpotifyArtwork, setIsFetchingSpotifyArtwork] = useState(false);
    const [spotifyArtworkError, setSpotifyArtworkError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        image: null as File | null,
        image_remove: false as boolean,
        judul: item?.judul ?? '',
        link_spotify: item?.link_spotify ?? '',
        active: item?.active ?? true,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        setImagePreview(item?.image_url ?? null);
        setImageRemove(false);
        setCompressInfo(null);
        setSpotifyArtworkError(false);
        onClose();
    };

    const handleImageFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) return;
        setIsCompressing(true);
        const originalSize = file.size;
        const compressed = await compressImage(file);
        setIsCompressing(false);
        setCompressInfo({ original: originalSize, compressed: compressed.size });
        setData('image', compressed);
        setData('image_remove', false);
        setImageRemove(false);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(compressed);
    }, [setData]);

    const handleFetchSpotifyArtwork = async (spotifyUrl: string) => {
        if (!isValidSpotifyUrl(spotifyUrl)) return;
        setIsFetchingSpotifyArtwork(true);
        setSpotifyArtworkError(false);
        const file = await fetchSpotifyArtwork(spotifyUrl);
        setIsFetchingSpotifyArtwork(false);
        if (!file) { setSpotifyArtworkError(true); return; }
        await handleImageFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageFile(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageRemove(true);
        setCompressInfo(null);
        setData('image', null);
        setData('image_remove', true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: handleClose,
        } as const;

        if (isEdit) {
            put(`/originals/${item!.id}`, options);
        } else {
            post('/originals', options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                            <Music className="size-4 text-white" />
                        </div>
                        {isEdit ? 'Edit Lagu Original' : 'Tambah Lagu Original'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Perbarui informasi lagu original band.' : 'Isi detail untuk menambahkan lagu original baru.'}
                    </DialogDescription>
                </DialogHeader>

                <form id="original-form" onSubmit={handleSubmit} className="space-y-5 py-1">
                    {/* Thumbnail — hidden until loaded from Spotify or manual upload after removal */}
                    {(isFetchingSpotifyArtwork || isCompressing || imagePreview || imageRemove) && (
                        <div className="space-y-2">
                            <Label>Thumbnail / Cover</Label>

                            {/* Loading skeleton while fetching from Spotify */}
                            {(isFetchingSpotifyArtwork || isCompressing) && !imagePreview ? (
                                <div className="flex h-44 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/30">
                                    <Loader2 className="size-8 animate-spin text-emerald-500" />
                                    <div className="space-y-1 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {isFetchingSpotifyArtwork ? 'Mengambil artwork Spotify...' : 'Mengoptimasi gambar...'}
                                        </p>
                                        <p className="text-xs text-muted-foreground/60">Mohon tunggu sebentar</p>
                                    </div>
                                </div>
                            ) : imagePreview ? (
                                /* Preview after loaded */
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-44 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                                        title="Hapus gambar"
                                    >
                                        <X className="size-4" />
                                    </button>
                                    {compressInfo && (
                                        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                                            {formatBytes(compressInfo.original)} → {formatBytes(compressInfo.compressed)}
                                            {' '}
                                            <span className="text-emerald-400">
                                                (-{Math.round((1 - compressInfo.compressed / compressInfo.original) * 100)}%)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : imageRemove ? (
                                /* Manual upload dropzone — only shown after user removes a preview */
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={[
                                        'flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
                                        isDragging
                                            ? 'border-emerald-500 bg-emerald-500/5'
                                            : 'border-sidebar-border/70 bg-muted/30 hover:border-emerald-400 hover:bg-emerald-500/5',
                                    ].join(' ')}
                                >
                                    <Upload className="size-8 text-muted-foreground" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Upload gambar manual
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        JPEG, PNG, WebP — auto dikompres ke WebP (maks 800×800)
                                    </p>
                                </div>
                            ) : null}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.image} />
                        </div>
                    )}

                    {/* Judul */}
                    <div className="space-y-2">
                        <Label htmlFor="original-judul">Judul Lagu <span className="text-destructive">*</span></Label>
                        <Input
                            id="original-judul"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            placeholder="Masukkan judul lagu..."
                            autoComplete="off"
                        />
                        <InputError message={errors.judul} />
                    </div>

                    {/* Link Spotify */}
                    <div className="space-y-2">
                        <Label htmlFor="original-spotify" className="flex items-center gap-1.5">
                            <SpotifyIcon className="size-3.5 text-emerald-500" />
                            Link Spotify
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="original-spotify"
                                value={data.link_spotify}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData('link_spotify', val);
                                    setSpotifyArtworkError(false);
                                    // Auto-fetch artwork if no image is set yet
                                    if (!imagePreview && isValidSpotifyUrl(val)) {
                                        handleFetchSpotifyArtwork(val);
                                    }
                                }}
                                placeholder="https://open.spotify.com/track/..."
                                autoComplete="off"
                                className="flex-1"
                            />
                            {/* Fetch artwork button — shown when valid Spotify URL detected */}
                            {isValidSpotifyUrl(data.link_spotify) && (
                                <button
                                    type="button"
                                    onClick={() => handleFetchSpotifyArtwork(data.link_spotify)}
                                    disabled={isFetchingSpotifyArtwork || isCompressing}
                                    title="Ambil artwork dari Spotify"
                                    className={[
                                        'flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                                        'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                    ].join(' ')}
                                >
                                    {isFetchingSpotifyArtwork ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <SpotifyIcon className="size-3.5" />
                                    )}
                                    {isFetchingSpotifyArtwork ? 'Mengambil...' : 'Ambil Artwork'}
                                </button>
                            )}
                        </div>
                        {spotifyArtworkError && (
                            <p className="text-xs text-red-500">Gagal mengambil artwork Spotify. Upload gambar secara manual.</p>
                        )}
                        {!spotifyArtworkError && isValidSpotifyUrl(data.link_spotify) && imagePreview && data.image && (
                            <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                                Artwork berhasil diambil dari Spotify
                            </p>
                        )}
                        <InputError message={errors.link_spotify} />
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-muted/20 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium">Status Aktif</p>
                            <p className="text-xs text-muted-foreground">Tampilkan lagu ini di website</p>
                        </div>
                        <Toggle
                            checked={data.active}
                            onChange={(v) => setData('active', v)}
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                        Batal
                    </Button>
                    <Button type="submit" form="original-form" disabled={processing || isCompressing}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700"
                    >
                        {processing && <Loader2 className="size-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Lagu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Delete Confirm Modal (SweetAlert2-style) ─────────────────────────────────

type DeleteModalProps = {
    open: boolean;
    item: OriginalItem | null;
    onClose: () => void;
};

function DeleteModal({ open, item, onClose }: DeleteModalProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!item) return;
        setProcessing(true);
        router.delete(`/originals/${item.id}`, {
            preserveScroll: true,
            onFinish: () => { setProcessing(false); onClose(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o && !processing) onClose(); }}>
            <DialogContent className="max-w-sm text-center">
                <div className="flex flex-col items-center gap-4 py-2">
                    {/* Warning icon */}
                    <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                        <AlertTriangle className="size-8 text-red-500" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Hapus Lagu?</h3>
                        <p className="text-sm text-muted-foreground">
                            Lagu <span className="font-medium text-foreground">"{item?.judul}"</span> akan dihapus
                            secara permanen beserta thumbnailnya. Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
                <DialogFooter className="mt-2 sm:justify-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                        className="flex-1"
                    >
                        {processing && <Loader2 className="size-4 animate-spin" />}
                        Ya, Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Originals({ originals }: PageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<OriginalItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<OriginalItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const handleEdit = (item: OriginalItem) => {
        setEditItem(item);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditItem(null);
    };

    const handleToggleActive = (item: OriginalItem) => {
        setTogglingId(item.id);
        router.patch(
            `/originals/${item.id}/active`,
            { active: !item.active },
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    return (
        <>
            <Head title="Originals" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <Music className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Originals</h1>
                        <p className="text-muted-foreground text-sm">Kelola lagu-lagu original dan karya band.</p>
                    </div>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">

                    {/* Card Header with Add Button */}
                    <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                        <div>
                            <p className="font-semibold">Daftar Lagu Original</p>
                            <p className="text-xs text-muted-foreground">{originals.length} lagu terdaftar</p>
                        </div>
                        <Button
                            id="btn-tambah-original"
                            size="sm"
                            onClick={() => { setEditItem(null); setFormOpen(true); }}
                            className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700"
                        >
                            <Plus className="size-4" />
                            Tambah Konten
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border/40 bg-muted/30">
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">Gambar</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Judul Lagu</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link Spotify</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">Active</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/30">
                                {originals.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50">
                                                    <Music className="size-7 text-muted-foreground/50" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Belum ada lagu original</p>
                                                    <p className="mt-0.5 text-sm text-muted-foreground/70">Klik tombol "Tambah Konten" untuk menambahkan lagu pertama.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    originals.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            {/* No */}
                                            <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                                {index + 1}
                                            </td>

                                            {/* Image */}
                                            <td className="px-6 py-4">
                                                {item.image_url ? (
                                                    <div className="size-14 overflow-hidden rounded-lg border border-sidebar-border/50">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.judul}
                                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex size-14 items-center justify-center rounded-lg border-2 border-dashed border-sidebar-border/70 bg-muted/30">
                                                        <ImageIcon className="size-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </td>

                                            {/* Judul */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold">{item.judul}</p>
                                            </td>

                                            {/* Link Spotify */}
                                            <td className="px-6 py-4">
                                                {item.link_spotify ? (
                                                    <a
                                                        href={item.link_spotify}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                                    >
                                                        <SpotifyIcon className="size-3" />
                                                        Spotify
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/50">—</span>
                                                )}
                                            </td>

                                            {/* Active Toggle */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <Toggle
                                                        checked={item.active}
                                                        onChange={() => handleToggleActive(item)}
                                                        disabled={togglingId === item.id}
                                                    />
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        id={`btn-edit-original-${item.id}`}
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border/50 bg-background text-muted-foreground transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        id={`btn-delete-original-${item.id}`}
                                                        type="button"
                                                        onClick={() => setDeleteItem(item)}
                                                        className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border/50 bg-background text-muted-foreground transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <OriginalFormModal
                key={editItem?.id ?? 'new'}
                open={formOpen}
                onClose={handleCloseForm}
                item={editItem}
            />
            <DeleteModal
                open={!!deleteItem}
                item={deleteItem}
                onClose={() => setDeleteItem(null)}
            />
        </>
    );
}

Originals.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Originals', href: '/originals' },
    ],
};
