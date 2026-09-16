<?php

namespace App\Http\Controllers;

use App\Models\AboutSection;
use App\Models\AppSetting;
use App\Models\HeroSlide;
use App\Models\Original;
use App\Models\Personel;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML sitemap.
     */
    public function index(): Response
    {
        $latestDates = collect([
            HeroSlide::max('updated_at'),
            AboutSection::max('updated_at'),
            Personel::max('updated_at'),
            Original::max('updated_at'),
            AppSetting::max('updated_at'),
        ])->filter();

        $lastmod = $latestDates->isNotEmpty()
            ? Carbon::parse($latestDates->max())->toIso8601String()
            : now()->toIso8601String();

        $urls = [
            [
                'loc' => url('/'),
                'lastmod' => $lastmod,
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
        ];

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }

    /**
     * Generate dynamic robots.txt file with sitemap reference.
     */
    public function robots(): Response
    {
        $sitemapUrl = url('/sitemap.xml');

        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            '# Disallow admin & auth routes',
            'Disallow: /dashboard',
            'Disallow: /hero',
            'Disallow: /about',
            'Disallow: /personel',
            'Disallow: /originals',
            'Disallow: /app-settings',
            'Disallow: /settings',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /forgot-password',
            'Disallow: /reset-password',
            '',
            "Sitemap: {$sitemapUrl}",
            '',
        ]);

        return response($content, 200)
            ->header('Content-Type', 'text/plain; charset=utf-8');
    }
}
