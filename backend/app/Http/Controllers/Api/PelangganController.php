<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    public function index()
    {
        $data = Pelanggan::latest()->get();

        return response()->json([
            'message' => 'Data pelanggan berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'no_telp' => 'required',
            'no_polisi' => 'required',
            'servis_terakhir' => 'nullable',
            'jumlah_service' => 'nullable|integer',
            'status' => 'required',
        ]);

        $data = Pelanggan::create([
            'nama' => $validated['nama'],
            'no_telp' => $validated['no_telp'],
            'no_polisi' => $validated['no_polisi'],
            'servis_terakhir' => $validated['servis_terakhir'] ?? null,
            'jumlah_service' => $validated['jumlah_service'] ?? 0,
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Data pelanggan berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = Pelanggan::findOrFail($id);

        return response()->json([
            'message' => 'Detail pelanggan berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = Pelanggan::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required',
            'no_telp' => 'required',
            'no_polisi' => 'required',
            'servis_terakhir' => 'nullable',
            'jumlah_service' => 'nullable|integer',
            'status' => 'required',
        ]);

        $data->update([
            'nama' => $validated['nama'],
            'no_telp' => $validated['no_telp'],
            'no_polisi' => $validated['no_polisi'],
            'servis_terakhir' => $validated['servis_terakhir'] ?? null,
            'jumlah_service' => $validated['jumlah_service'] ?? 0,
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Data pelanggan berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = Pelanggan::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data pelanggan berhasil dihapus'
        ]);
    }
}