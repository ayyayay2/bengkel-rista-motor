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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('no_transaksi')->unique();

            $table->string('nama_pelanggan');
            $table->string('no_telp')->nullable();
            $table->string('no_polisi');

            $table->string('merk')->nullable();
            $table->string('tipe')->nullable();

            $table->string('jenis_service');
            $table->text('keluhan')->nullable();
            $table->string('mekanik')->nullable();

            $table->integer('biaya_jasa')->default(0);
            $table->integer('biaya_sparepart')->default(0);
            $table->integer('total_biaya')->default(0);

            $table->string('status')->default('PROSES');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
