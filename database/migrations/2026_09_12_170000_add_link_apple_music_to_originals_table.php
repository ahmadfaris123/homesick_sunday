<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('originals', function (Blueprint $table) {
            $table->string('link_apple_music', 500)->nullable()->after('link_spotify');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('originals', function (Blueprint $table) {
            $table->dropColumn('link_apple_music');
        });
    }
};
