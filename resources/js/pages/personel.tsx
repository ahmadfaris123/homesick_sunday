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
    Users,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type PersonelItem = {
    id: number;
    image_url: string | null;
    nama: string;
    posisi: string;
    active: boolean;
};

type PageProps = {
    personel: PersonelItem[];
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

// ─── Personel Form Modal ──────────────────────────────────────────────────────

type PersonelFormProps = {
    open: boolean;
    onClose: () => void;
    item?: PersonelItem | null;
};

function PersonelFormModal({ open, onClose, item }: PersonelFormProps) {
    const isEdit = !!item;

    const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
    const [imageRemove, setImageRemove] = useState(false);
    const [compressInfo, setCompressInfo] = useState<{ original: number; compressed: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        image: null as File | null,
        image_remove: false as boolean,
        nama: item?.nama ?? '',
        posisi: item?.posisi ?? '',
        active: item?.active ?? true,
    });

    const handleClose = () => {
        reset();
        clearErrors();
        setImagePreview(item?.image_url ?? null);
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
            put(`/personel/${item!.id}`, options);
        } else {
            post('/personel', options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                            <Users className="size-4 text-white" />
                        </div>
                        {isEdit ? 'Edit Personel' : 'Tambah Personel'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Perbarui informasi anggota band.' : 'Isi detail untuk menambahkan anggota band baru.'}
                    </DialogDescription>
                </DialogHeader>

                <form id="personel-form" onSubmit={handleSubmit} className="space-y-5 py-1">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Foto Personel</Label>
                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-44 w-full object-cover object-top"
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
                                        ? 'border-indigo-500 bg-indigo-500/5'
                                        : 'border-sidebar-border/70 bg-muted/30 hover:border-indigo-400 hover:bg-indigo-500/5',
                                ].join(' ')}
                            >
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="size-8 animate-spin text-indigo-500" />
                                        <p className="text-sm text-muted-foreground">Mengoptimasi gambar...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-8 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Klik atau drag &amp; drop foto
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            JPEG, PNG, WebP — auto dikompres ke WebP (maks 800×800)
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

                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="personel-nama">Nama <span className="text-destructive">*</span></Label>
                        <Input
                            id="personel-nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Masukkan nama anggota..."
                            autoComplete="off"
                        />
                        <InputError message={errors.nama} />
                    </div>

                    {/* Posisi */}
                    <div className="space-y-2">
                        <Label htmlFor="personel-posisi">Posisi <span className="text-destructive">*</span></Label>
                        <Input
                            id="personel-posisi"
                            value={data.posisi}
                            onChange={(e) => setData('posisi', e.target.value)}
                            placeholder="Contoh: Vokalis, Gitaris, Bassist..."
                            autoComplete="off"
                        />
                        <InputError message={errors.posisi} />
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-muted/20 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium">Status Aktif</p>
                            <p className="text-xs text-muted-foreground">Tampilkan personel ini di website</p>
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
                    <Button type="submit" form="personel-form" disabled={processing || isCompressing}>
                        {processing && <Loader2 className="size-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Personel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Delete Confirm Modal (SweetAlert2-style) ─────────────────────────────────

type DeleteModalProps = {
    open: boolean;
    item: PersonelItem | null;
    onClose: () => void;
};

function DeleteModal({ open, item, onClose }: DeleteModalProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!item) return;
        setProcessing(true);
        router.delete(`/personel/${item.id}`, {
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
                        <h3 className="text-lg font-semibold">Hapus Personel?</h3>
                        <p className="text-sm text-muted-foreground">
                            Personel <span className="font-medium text-foreground">"{item?.nama}"</span> akan dihapus
                            secara permanen beserta fotonya. Tindakan ini tidak dapat dibatalkan.
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

export default function Personel({ personel }: PageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<PersonelItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<PersonelItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const handleEdit = (item: PersonelItem) => {
        setEditItem(item);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditItem(null);
    };

    const handleToggleActive = (item: PersonelItem) => {
        setTogglingId(item.id);
        router.patch(
            `/personel/${item.id}/active`,
            { active: !item.active },
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    return (
        <>
            <Head title="Personel" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
                        <Users className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Personel</h1>
                        <p className="text-muted-foreground text-sm">Kelola profil anggota dan personel band.</p>
                    </div>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">

                    {/* Card Header with Add Button */}
                    <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                        <div>
                            <p className="font-semibold">Daftar Personel</p>
                            <p className="text-xs text-muted-foreground">{personel.length} anggota terdaftar</p>
                        </div>
                        <Button
                            id="btn-tambah-personel"
                            size="sm"
                            onClick={() => { setEditItem(null); setFormOpen(true); }}
                            className="gap-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700"
                        >
                            <Plus className="size-4" />
                            Tambah Personel
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border/40 bg-muted/30">
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">Gambar</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Posisi</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">Active</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/30">
                                {personel.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50">
                                                    <Users className="size-7 text-muted-foreground/50" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Belum ada personel</p>
                                                    <p className="mt-0.5 text-sm text-muted-foreground/70">Klik tombol "Tambah Personel" untuk menambahkan anggota pertama.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    personel.map((item, index) => (
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
                                                    <div className="size-16 overflow-hidden rounded-full border-2 border-sidebar-border/50">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.nama}
                                                            className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-sidebar-border/70 bg-muted/30">
                                                        <ImageIcon className="size-6 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </td>

                                            {/* Nama */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold">{item.nama}</p>
                                            </td>

                                            {/* Posisi */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                                                    {item.posisi}
                                                </span>
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
                                                        id={`btn-edit-personel-${item.id}`}
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border/50 bg-background text-muted-foreground transition-colors hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        id={`btn-delete-personel-${item.id}`}
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
            <PersonelFormModal
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

Personel.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Personel', href: '/personel' },
    ],
};
