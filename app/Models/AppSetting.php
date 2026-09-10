<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string|null $logo
 * @property string $app_name
 * @property string|null $email
 * @property string|null $phone_number
 * @property string|null $instagram_url
 * @property string|null $tiktok_url
 * @property string|null $youtube_url
 * @property string|null $latest_video_url
 */
class AppSetting extends Model
{
    protected $fillable = [
        'logo',
        'app_name',
        'email',
        'phone_number',
        'instagram_url',
        'tiktok_url',
        'youtube_url',
        'latest_video_url',
    ];

    /**
     * Get the public URL for the logo.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo) {
            return null;
        }

        return Storage::url($this->logo);
    }

    /**
     * Get or create the singleton app settings record.
     */
    public static function getSingleton(): static
    {
        return static::firstOrCreate([], [
            'app_name' => config('app.name'),
        ]);
    }
}
