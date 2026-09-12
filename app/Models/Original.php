<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string|null $image
 * @property string $judul
 * @property string|null $link_spotify
 * @property string|null $link_apple_music
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Original extends Model
{
    protected $table = 'originals';

    protected $fillable = [
        'image',
        'judul',
        'link_spotify',
        'link_apple_music',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get the public URL for the image.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return Storage::url($this->image);
    }
}
