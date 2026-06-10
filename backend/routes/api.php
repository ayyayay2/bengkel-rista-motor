<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StokSukuCadangController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\PengeluaranController;

Route::apiResource('stok-suku-cadang', StokSukuCadangController::class);
Route::apiResource('karyawan', KaryawanController::class);
Route::apiResource('pelanggan', PelangganController::class);
Route::apiResource('kendaraan', KendaraanController::class);
Route::apiResource('transaksi', TransaksiController::class);
Route::apiResource('pengeluaran', PengeluaranController::class);