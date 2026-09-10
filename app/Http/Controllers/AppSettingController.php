<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAppSettingRequest;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingController extends Controller
{
    /**
     * Show the app settings page.
     */
    public function edit(): Response
    {
        $settings = AppSetting::getSingleton();

        return Inertia::render('app-settings', [
            'settings' => [
                'id'            => $settings->id,
                'logo_url'      => $settings->logo_url,
                'app_name'      => $settings->app_name,
                'email'         => $settings->email,
                'phone_number'  => $settings->phone_number,
                'instagram_url' => $settings->instagram_url,
                'tiktok_url'    => $settings->tiktok_url,
                'youtube_url'       => $settings->youtube_url,
                'latest_video_url'  => $settings->latest_video_url,
            ],
        ]);
    }

    /**
     * Update the app settings.
     */
    public function update(UpdateAppSettingRequest $request): RedirectResponse
    {
        $settings = AppSetting::getSingleton();

        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $data['logo'] = $path;
        } elseif ($request->boolean('logo_remove')) {
            // Remove logo without uploading a new one
            if ($settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }
            $data['logo'] = null;
        }

        // Remove non-fillable keys
        unset($data['logo_remove']);

        $settings->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengaturan aplikasi berhasil disimpan.']);

        return to_route('app-settings.edit');
    }
}
