<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAboutSectionRequest;
use App\Models\AboutSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Show the about section page.
     */
    public function edit(): Response
    {
        $about = AboutSection::getSingleton();

        return Inertia::render('about', [
            'about' => [
                'id'          => $about->id,
                'image_url'   => $about->image_url,
                'title'       => $about->title,
                'description' => $about->description,
                'active'      => $about->active,
            ],
        ]);
    }

    /**
     * Update the about section.
     */
    public function update(UpdateAboutSectionRequest $request): RedirectResponse
    {
        $about = AboutSection::getSingleton();

        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($about->image) {
                Storage::disk('public')->delete($about->image);
            }
            $path = $request->file('image')->store('about-sections', 'public');
            $data['image'] = $path;
        } elseif ($request->boolean('image_remove')) {
            if ($about->image) {
                Storage::disk('public')->delete($about->image);
            }
            $data['image'] = null;
        }

        // Remove non-fillable keys
        unset($data['image_remove']);

        $data['active'] = $request->boolean('active', $about->active);

        $about->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten about berhasil disimpan.']);

        return to_route('about.edit');
    }
}
