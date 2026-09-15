<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'homesicksunday@email.com',
            'password' => Hash::make('Webhomesicksunday@2026'),
        ]);

        $this->call([
            AppSettingSeeder::class,
        ]);
    }
}
