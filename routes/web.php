<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\OriginalController;
use App\Http\Controllers\PersonelController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'landing_2')->name('home');
Route::inertia('/landing_2', 'landing_backup')->name('landing-2');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('hero', HeroController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('hero/{heroSlide}/active', [HeroController::class, 'updateActive'])->name('hero.update-active');
    Route::get('about', [AboutController::class, 'edit'])->name('about.edit');
    Route::post('about', [AboutController::class, 'update'])->name('about.update');
    Route::resource('personel', PersonelController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('personel/{personel}/active', [PersonelController::class, 'updateActive'])->name('personel.update-active');
    Route::resource('originals', OriginalController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('originals/{original}/active', [OriginalController::class, 'updateActive'])->name('originals.update-active');
    Route::get('app-settings', [AppSettingController::class, 'edit'])->name('app-settings.edit');
    Route::post('app-settings', [AppSettingController::class, 'update'])->name('app-settings.update');
});

require __DIR__.'/settings.php';

