<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePersonelRequest extends FormRequest
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
            'nama'         => ['required', 'string', 'max:255'],
            'posisi'       => ['required', 'string', 'max:100'],
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
            'image'  => 'Gambar',
            'nama'   => 'Nama',
            'posisi' => 'Posisi',
            'active' => 'Status Aktif',
        ];
    }
}
