<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOriginalRequest;
use App\Http\Requests\UpdateOriginalRequest;
use App\Models\Original;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OriginalController extends Controller
{
    /**
     * Display the originals management page.
     */
    public function index(): Response
    {
        $originals = Original::latest()->get()->map(fn ($o) => [
            'id'           => $o->id,
            'image_url'    => $o->image_url,
            'judul'        => $o->judul,
            'link_spotify' => $o->link_spotify,
            'active'       => $o->active,
            'created_at'   => $o->created_at,
        ]);

        return Inertia::render('originals', [
            'originals' => $originals,
        ]);
    }

    /**
     * Store a newly created original song.
     */
    public function store(StoreOriginalRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('originals', 'public');
            $data['image'] = $path;
        }

        $data['active'] = $request->boolean('active', true);

        Original::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lagu original berhasil ditambahkan.']);

        return to_route('originals.index');
    }

    /**
     * Update the specified original song.
     */
    public function update(UpdateOriginalRequest $request, Original $original): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($original->image) {
                Storage::disk('public')->delete($original->image);
            }
            $path = $request->file('image')->store('originals', 'public');
            $data['image'] = $path;
        } elseif ($request->boolean('image_remove')) {
            if ($original->image) {
                Storage::disk('public')->delete($original->image);
            }
            $data['image'] = null;
        }

        // Remove non-fillable keys
        unset($data['image_remove']);

        $data['active'] = $request->boolean('active', $original->active);

        $original->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lagu original berhasil diperbarui.']);

        return to_route('originals.index');
    }

    /**
     * Toggle the active status of the specified original.
     */
    public function updateActive(Request $request, Original $original): RedirectResponse
    {
        $request->validate([
            'active' => ['required', 'boolean'],
        ]);

        $original->update(['active' => $request->boolean('active')]);

        Inertia::flash('toast', [
            'type'    => 'success',
            'message' => 'Status lagu berhasil diperbarui.',
        ]);

        return to_route('originals.index');
    }

    /**
     * Remove the specified original song.
     */
    public function destroy(Original $original): RedirectResponse
    {
        // Delete image file if exists
        if ($original->image) {
            Storage::disk('public')->delete($original->image);
        }

        $original->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lagu original berhasil dihapus.']);

        return to_route('originals.index');
    }
}
