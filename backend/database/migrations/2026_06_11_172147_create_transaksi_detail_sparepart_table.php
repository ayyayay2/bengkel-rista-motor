<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_detail_sparepart', function (Blueprint $table) {
            $table->id();

            $table->foreignId('transaksi_id')
                ->constrained('transaksi')
                ->onDelete('cascade');

            $table->foreignId('stok_suku_cadang_id')
                ->constrained('stok_suku_cadang')
                ->onDelete('restrict');

            $table->string('nama_suku_cadang');
            $table->integer('harga');
            $table->integer('jumlah');
            $table->integer('subtotal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_detail_sparepart');
    }
};