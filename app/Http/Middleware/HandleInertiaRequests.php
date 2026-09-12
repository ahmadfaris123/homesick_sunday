<?php

namespace App\Http\Middleware;

use App\Models\AboutSection;
use App\Models\AppSetting;
use App\Models\HeroSlide;
use App\Models\Original;
use App\Models\Personel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $appSettings = AppSetting::getSingleton();
        $aboutSection = AboutSection::getSingleton();
        $heroSlides = HeroSlide::where('active', true)->latest()->get()->map(fn ($slide) => [
            'id'          => $slide->id,
            'image_url'   => $slide->image_url,
            'title'       => $slide->title,
            'description' => $slide->description,
        ]);
        $personel = Personel::where('active', true)->latest()->get()->map(fn ($p) => [
            'id'        => $p->id,
            'nama'      => $p->nama,
            'posisi'    => $p->posisi,
            'image_url' => $p->image_url,
        ]);
        $originals = Original::where('active', true)->latest()->get()->map(function ($o) {
            $spotifyArtwork = null;
            if ($o->link_spotify) {
                $cacheKey = 'spotify_art_' . md5($o->link_spotify);
                $spotifyArtwork = Cache::remember($cacheKey, 86400 * 7, function () use ($o) {
                    try {
                        $res = Http::timeout(2)->get('https://open.spotify.com/oembed', [
                            'url' => $o->link_spotify,
                        ]);
                        if ($res->successful()) {
                            $thumb = $res->json('thumbnail_url');
                            if ($thumb) {
                                return str_replace('ab67616d00001e02', 'ab67616d0000b273', $thumb);
                            }
                        }
                    } catch (\Throwable $e) {
                        return null;
                    }
                    return null;
                });
            }

            return [
                'id'                  => $o->id,
                'judul'               => $o->judul,
                'image_url'           => $o->image_url,
                'spotify_artwork_url' => $spotifyArtwork,
                'link_spotify'        => $o->link_spotify,
                'link_apple_music'    => $o->link_apple_music,
            ];
        });

        return [
            ...parent::share($request),
            'name' => $appSettings->app_name ?: config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'appSettings' => [
                'app_name'      => $appSettings->app_name,
                'logo_url'      => $appSettings->logo_url,
                'email'         => $appSettings->email,
                'phone_number'  => $appSettings->phone_number,
                'instagram_url'     => $appSettings->instagram_url,
                'tiktok_url'        => $appSettings->tiktok_url,
                'youtube_url'       => $appSettings->youtube_url,
                'latest_video_url'  => $appSettings->latest_video_url,
            ],
            'aboutSection' => [
                'image_url'   => $aboutSection->image_url,
                'title'       => $aboutSection->title,
                'description' => $aboutSection->description,
                'active'      => $aboutSection->active,
            ],
            'heroSlides' => $heroSlides,
            'personel'   => $personel,
            'originals'  => $originals,
        ];
    }
}

