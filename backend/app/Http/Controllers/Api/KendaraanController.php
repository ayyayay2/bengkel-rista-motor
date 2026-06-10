<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use Illuminate\Http\Request;

class KendaraanController extends Controller
{
    public function index()
    {
        $data = Kendaraan::latest()->get();

        return response()->json([
            'message' => 'Data kendaraan berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|unique:kendaraan,plat_nomor',
            'pemilik' => 'required',
            'merk' => 'required',
            'tipe' => 'required',
            'tahun' => 'nullable',
            'warna' => 'nullable',
            'servis_terakhir' => 'nullable',
            'status' => 'required',
        ]);

        $data = Kendaraan::create($validated);

        return response()->json([
            'message' => 'Data kendaraan berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = Kendaraan::findOrFail($id);

        return response()->json([
            'message' => 'Detail kendaraan berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = Kendaraan::findOrFail($id);

        $validated = $request->validate([
            'plat_nomor' => 'required|unique:kendaraan,plat_nomor,' . $id,
            'pemilik' => 'required',
            'merk' => 'required',
            'tipe' => 'required',
            'tahun' => 'nullable',
            'warna' => 'nullable',
            'servis_terakhir' => 'nullable',
            'status' => 'required',
        ]);

        $data->update($validated);

        return response()->json([
            'message' => 'Data kendaraan berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = Kendaraan::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data kendaraan berhasil dihapus'
        ]);
    }
}