<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logo'          => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'logo_remove'   => ['nullable', 'boolean'],
            'app_name'      => ['required', 'string', 'max:100'],
            'email'         => ['nullable', 'email', 'max:150'],
            'phone_number'  => ['nullable', 'string', 'max:20'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url'    => ['nullable', 'url', 'max:255'],
            'youtube_url'       => ['nullable', 'url', 'max:255'],
            'latest_video_url'  => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * Get custom attribute names for validator error messages.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'logo'              => 'Logo Aplikasi',
            'app_name'          => 'Nama Brand',
            'email'             => 'Email',
            'phone_number'      => 'Nomor Telepon',
            'instagram_url'     => 'URL Instagram',
            'tiktok_url'        => 'URL TikTok',
            'youtube_url'       => 'URL YouTube',
            'latest_video_url'  => 'URL Latest Video',
        ];
    }
}
