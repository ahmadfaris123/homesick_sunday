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
    Images,
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
import HeroController from '@/actions/App/Http/Controllers/HeroController';

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroSlide = {
    id: number;
    image_url: string | null;
    title: string;
    description: string | null;
    active: boolean;
};

type PageProps = {
    slides: HeroSlide[];
};

// ─── Image compression utility ────────────────────────────────────────────────

async function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<File> {
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

// ─── Slide Form Modal ─────────────────────────────────────────────────────────

type SlideFormProps = {
    open: boolean;
    onClose: () => void;
    slide?: HeroSlide | null;
};

function SlideFormModal({ open, onClose, slide }: SlideFormProps) {
    const isEdit = !!slide;

    const [imagePreview, setImagePreview] = useState<string | null>(slide?.image_url ?? null);
    const [imageRemove, setImageRemove] = useState(false);
    const [compressInfo, setCompressInfo] = useState<{ original: number; compressed: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        image: null as File | null,
        image_remove: false as boolean,
        title: slide?.title ?? '',
        description: slide?.description ?? '',
        active: slide?.active ?? true,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        setImagePreview(slide?.image_url ?? null);
        setImageRemove(false);
        setCompressInfo(null);
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
            put(HeroController.update.url(slide!.id), options);
        } else {
            post(HeroController.store.url(), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                            <Images className="size-4 text-white" />
                        </div>
                        {isEdit ? 'Edit Konten Hero' : 'Tambah Konten Hero'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Perbarui informasi slide hero carousel.' : 'Isi detail untuk menambahkan slide baru ke hero carousel.'}
                    </DialogDescription>
                </DialogHeader>

                <form id="slide-form" onSubmit={handleSubmit} className="space-y-5 py-1">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Gambar Hero</Label>
                        {imagePreview ? (
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
                        ) : (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={[
                                    'flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
                                    isDragging
                                        ? 'border-violet-500 bg-violet-500/5'
                                        : 'border-sidebar-border/70 bg-muted/30 hover:border-violet-400 hover:bg-violet-500/5',
                                ].join(' ')}
                            >
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="size-8 animate-spin text-violet-500" />
                                        <p className="text-sm text-muted-foreground">Mengoptimasi gambar...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-8 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Klik atau drag & drop gambar
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            JPEG, PNG, WebP — auto dikompres ke WebP
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <InputError message={errors.image} />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="slide-title">Judul <span className="text-destructive">*</span></Label>
                        <Input
                            id="slide-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Masukkan judul hero..."
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="slide-description">Deskripsi</Label>
                        <textarea
                            id="slide-description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Masukkan deskripsi hero (opsional)..."
                            rows={3}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-muted/20 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium">Status Aktif</p>
                            <p className="text-xs text-muted-foreground">Tampilkan slide ini di website</p>
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
                    <Button type="submit" form="slide-form" disabled={processing || isCompressing}>
                        {processing && <Loader2 className="size-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Konten'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Delete Confirm Modal (SweetAlert2-style) ─────────────────────────────────

type DeleteModalProps = {
    open: boolean;
    slide: HeroSlide | null;
    onClose: () => void;
};

function DeleteModal({ open, slide, onClose }: DeleteModalProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!slide) return;
        setProcessing(true);
        router.delete(HeroController.destroy.url(slide.id), {
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
                        <h3 className="text-lg font-semibold">Hapus Konten Hero?</h3>
                        <p className="text-sm text-muted-foreground">
                            Konten <span className="font-medium text-foreground">"{slide?.title}"</span> akan dihapus
                            secara permanen beserta gambarnya. Tindakan ini tidak dapat dibatalkan.
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

export default function Hero({ slides }: PageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
    const [deleteSlide, setDeleteSlide] = useState<HeroSlide | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const handleEdit = (slide: HeroSlide) => {
        setEditSlide(slide);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditSlide(null);
    };

    const handleToggleActive = (slide: HeroSlide) => {
        setTogglingId(slide.id);
        router.patch(
            HeroController.updateActive.url(slide.id),
            { active: !slide.active },
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    return (
        <>
            <Head title="Hero" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                        <Images className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Hero Section</h1>
                        <p className="text-muted-foreground text-sm">Kelola tampilan utama hero carousel website.</p>
                    </div>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">

                    {/* Card Header with Add Button */}
                    <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                        <div>
                            <p className="font-semibold">Daftar Konten Hero</p>
                            <p className="text-xs text-muted-foreground">{slides.length} slide terdaftar</p>
                        </div>
                        <Button
                            id="btn-tambah-hero"
                            size="sm"
                            onClick={() => { setEditSlide(null); setFormOpen(true); }}
                            className="gap-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-600 hover:to-indigo-700"
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
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deskripsi</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">Active</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/30">
                                {slides.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50">
                                                    <ImageIcon className="size-7 text-muted-foreground/50" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Belum ada konten hero</p>
                                                    <p className="mt-0.5 text-sm text-muted-foreground/70">Klik tombol "Tambah Konten" untuk menambahkan slide pertama.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    slides.map((slide, index) => (
                                        <tr
                                            key={slide.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            {/* No */}
                                            <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                                {index + 1}
                                            </td>

                                            {/* Image */}
                                            <td className="px-6 py-4">
                                                {slide.image_url ? (
                                                    <div className="size-16 overflow-hidden rounded-lg border border-sidebar-border/50">
                                                        <img
                                                            src={slide.image_url}
                                                            alt={slide.title}
                                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex size-16 items-center justify-center rounded-lg border border-dashed border-sidebar-border/70 bg-muted/30">
                                                        <ImageIcon className="size-6 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </td>

                                            {/* Title */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold line-clamp-2 max-w-[200px]">{slide.title}</p>
                                            </td>

                                            {/* Description */}
                                            <td className="px-6 py-4">
                                                {slide.description ? (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-[250px]">
                                                        {slide.description}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/40 italic">Tidak ada deskripsi</span>
                                                )}
                                            </td>

                                            {/* Active Toggle */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <Toggle
                                                        checked={slide.active}
                                                        onChange={() => handleToggleActive(slide)}
                                                        disabled={togglingId === slide.id}
                                                    />
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        id={`btn-edit-hero-${slide.id}`}
                                                        type="button"
                                                        onClick={() => handleEdit(slide)}
                                                        className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border/50 bg-background text-muted-foreground transition-colors hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        id={`btn-delete-hero-${slide.id}`}
                                                        type="button"
                                                        onClick={() => setDeleteSlide(slide)}
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
            <SlideFormModal
                key={editSlide?.id ?? 'new'}
                open={formOpen}
                onClose={handleCloseForm}
                slide={editSlide}
            />
            <DeleteModal
                open={!!deleteSlide}
                slide={deleteSlide}
                onClose={() => setDeleteSlide(null)}
            />
        </>
    );
}

Hero.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hero', href: '/hero' },
    ],
};
