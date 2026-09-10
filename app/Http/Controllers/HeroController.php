<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHeroSlideRequest;
use App\Http\Requests\UpdateHeroSlideRequest;
use App\Models\HeroSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    /**
     * Display the hero slides management page.
     */
    public function index(): Response
    {
        $slides = HeroSlide::latest()->get()->map(fn ($slide) => [
            'id'          => $slide->id,
            'image_url'   => $slide->image_url,
            'title'       => $slide->title,
            'description' => $slide->description,
            'active'      => $slide->active,
            'created_at'  => $slide->created_at,
        ]);

        return Inertia::render('hero', [
            'slides' => $slides,
        ]);
    }

    /**
     * Store a newly created hero slide.
     */
    public function store(StoreHeroSlideRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hero-slides', 'public');
            $data['image'] = $path;
        }

        $data['active'] = $request->boolean('active', true);

        HeroSlide::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten hero berhasil ditambahkan.']);

        return to_route('hero.index');
    }

    /**
     * Update the specified hero slide.
     */
    public function update(UpdateHeroSlideRequest $request, HeroSlide $hero): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($hero->image) {
                Storage::disk('public')->delete($hero->image);
            }
            $path = $request->file('image')->store('hero-slides', 'public');
            $data['image'] = $path;
        } elseif ($request->boolean('image_remove')) {
            if ($hero->image) {
                Storage::disk('public')->delete($hero->image);
            }
            $data['image'] = null;
        }

        // Remove non-fillable keys
        unset($data['image_remove']);

        $data['active'] = $request->boolean('active', $hero->active);

        $hero->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten hero berhasil diperbarui.']);

        return to_route('hero.index');
    }

    /**
     * Toggle the active status of the specified hero slide.
     */
    public function updateActive(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $request->validate([
            'active' => ['required', 'boolean'],
        ]);

        $heroSlide->update(['active' => $request->boolean('active')]);

        Inertia::flash('toast', [
            'type'    => 'success',
            'message' => 'Status hero berhasil diperbarui.',
        ]);

        return to_route('hero.index');
    }

    /**
     * Remove the specified hero slide.
     */
    public function destroy(HeroSlide $hero): RedirectResponse
    {
        // Delete image file if exists
        if ($hero->image) {
            Storage::disk('public')->delete($hero->image);
        }

        $hero->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten hero berhasil dihapus.']);

        return to_route('hero.index');
    }
}
