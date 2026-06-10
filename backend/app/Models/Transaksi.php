<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';

    protected $fillable = [
        'tanggal',
        'no_transaksi',
        'nama_pelanggan',
        'no_telp',
        'no_polisi',
        'merk',
        'tipe',
        'jenis_service',
        'keluhan',
        'mekanik',
        'biaya_jasa',
        'biaya_sparepart',
        'total_biaya',
        'status',
    ];
}