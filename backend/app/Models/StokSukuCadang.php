<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokSukuCadang extends Model
{
    protected $table = 'stok_suku_cadang';

    protected $fillable = [
        'no_seri',
        'nama_suku_cadang',
        'kategori',
        'harga',
        'stok',
        'stok_minimum',
        'status',
    ];
}