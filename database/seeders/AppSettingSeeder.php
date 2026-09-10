<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AppSetting::firstOrCreate([], [
            'app_name'      => config('app.name', 'My Application'),
            'email'         => null,
            'phone_number'  => null,
            'instagram_url' => null,
            'tiktok_url'    => null,
            'youtube_url'   => null,
        ]);
    }
}
