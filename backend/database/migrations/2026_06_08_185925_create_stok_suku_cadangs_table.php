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
        Schema::create('stok_suku_cadang', function (Blueprint $table) {
            $table->id();
            $table->string('no_seri')->unique();
            $table->string('nama_suku_cadang');
            $table->string('kategori');
            $table->integer('harga');
            $table->integer('stok');
            $table->integer('stok_minimum')->default(5);
            $table->string('status')->default('Tersedia');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_suku_cadang');
    }
};
