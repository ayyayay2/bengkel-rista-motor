<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiDetailSparepart extends Model
{
    protected $table = 'transaksi_detail_sparepart';

    protected $fillable = [
        'transaksi_id',
        'stok_suku_cadang_id',
        'nama_suku_cadang',
        'harga',
        'jumlah',
        'subtotal',
    ];
}