<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StokSukuCadang;
use Illuminate\Http\Request;

class StokSukuCadangController extends Controller
{
    public function index()
    {
        $data = StokSukuCadang::latest()->get();

        return response()->json([
            'message' => 'Data stok suku cadang berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_seri' => 'required|unique:stok_suku_cadang,no_seri',
            'nama_suku_cadang' => 'required',
            'kategori' => 'required',
            'harga' => 'required|integer',
            'stok' => 'required|integer',
            'stok_minimum' => 'nullable|integer',
        ]);

        $stok = $validated['stok'];
        $stokMinimum = $validated['stok_minimum'] ?? 5;

        if ($stok <= 0) {
            $status = 'Habis';
        } elseif ($stok <= $stokMinimum) {
            $status = 'Menipis';
        } else {
            $status = 'Tersedia';
        }

        $data = StokSukuCadang::create([
            'no_seri' => $validated['no_seri'],
            'nama_suku_cadang' => $validated['nama_suku_cadang'],
            'kategori' => $validated['kategori'],
            'harga' => $validated['harga'],
            'stok' => $stok,
            'stok_minimum' => $stokMinimum,
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Data stok suku cadang berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = StokSukuCadang::findOrFail($id);

        return response()->json([
            'message' => 'Detail stok suku cadang berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = StokSukuCadang::findOrFail($id);

        $validated = $request->validate([
            'no_seri' => 'required|unique:stok_suku_cadang,no_seri,' . $id,
            'nama_suku_cadang' => 'required',
            'kategori' => 'required',
            'harga' => 'required|integer',
            'stok' => 'required|integer',
            'stok_minimum' => 'nullable|integer',
        ]);

        $stok = $validated['stok'];
        $stokMinimum = $validated['stok_minimum'] ?? 5;

        if ($stok <= 0) {
            $status = 'Habis';
        } elseif ($stok <= $stokMinimum) {
            $status = 'Menipis';
        } else {
            $status = 'Tersedia';
        }

        $data->update([
            'no_seri' => $validated['no_seri'],
            'nama_suku_cadang' => $validated['nama_suku_cadang'],
            'kategori' => $validated['kategori'],
            'harga' => $validated['harga'],
            'stok' => $stok,
            'stok_minimum' => $stokMinimum,
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Data stok suku cadang berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = StokSukuCadang::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data stok suku cadang berhasil dihapus'
        ]);
    }
}