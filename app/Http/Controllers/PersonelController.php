<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePersonelRequest;
use App\Http\Requests\UpdatePersonelRequest;
use App\Models\Personel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PersonelController extends Controller
{
    /**
     * Display the personel management page.
     */
    public function index(): Response
    {
        $personel = Personel::latest()->get()->map(fn ($p) => [
            'id'        => $p->id,
            'image_url' => $p->image_url,
            'nama'      => $p->nama,
            'posisi'    => $p->posisi,
            'active'    => $p->active,
            'created_at' => $p->created_at,
        ]);

        return Inertia::render('personel', [
            'personel' => $personel,
        ]);
    }

    /**
     * Store a newly created personel.
     */
    public function store(StorePersonelRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('personel', 'public');
            $data['image'] = $path;
        }

        $data['active'] = $request->boolean('active', true);

        Personel::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Personel berhasil ditambahkan.']);

        return to_route('personel.index');
    }

    /**
     * Update the specified personel.
     */
    public function update(UpdatePersonelRequest $request, Personel $personel): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($personel->image) {
                Storage::disk('public')->delete($personel->image);
            }
            $path = $request->file('image')->store('personel', 'public');
            $data['image'] = $path;
        } elseif ($request->boolean('image_remove')) {
            if ($personel->image) {
                Storage::disk('public')->delete($personel->image);
            }
            $data['image'] = null;
        }

        // Remove non-fillable keys
        unset($data['image_remove']);

        $data['active'] = $request->boolean('active', $personel->active);

        $personel->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Personel berhasil diperbarui.']);

        return to_route('personel.index');
    }

    /**
     * Toggle the active status of the specified personel.
     */
    public function updateActive(Request $request, Personel $personel): RedirectResponse
    {
        $request->validate([
            'active' => ['required', 'boolean'],
        ]);

        $personel->update(['active' => $request->boolean('active')]);

        Inertia::flash('toast', [
            'type'    => 'success',
            'message' => 'Status personel berhasil diperbarui.',
        ]);

        return to_route('personel.index');
    }

    /**
     * Remove the specified personel.
     */
    public function destroy(Personel $personel): RedirectResponse
    {
        // Delete image file if exists
        if ($personel->image) {
            Storage::disk('public')->delete($personel->image);
        }

        $personel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Personel berhasil dihapus.']);

        return to_route('personel.index');
    }
}
