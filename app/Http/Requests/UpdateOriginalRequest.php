<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOriginalRequest extends FormRequest
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
            'image'        => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'image_remove' => ['nullable', 'boolean'],
            'judul'        => ['required', 'string', 'max:255'],
            'link_spotify' => ['nullable', 'string', 'max:500'],
            'active'       => ['nullable', 'boolean'],
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
            'image'        => 'Thumbnail',
            'judul'        => 'Judul Lagu',
            'link_spotify' => 'Link Spotify',
            'active'       => 'Status Aktif',
        ];
    }
}
