<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    protected $table = 'kendaraan';

    protected $fillable = [
        'plat_nomor',
        'pemilik',
        'merk',
        'tipe',
        'tahun',
        'warna',
        'servis_terakhir',
        'status',
    ];
}