<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index()
    {
        $data = Pengeluaran::latest()->get();

        return response()->json([
            'message' => 'Data pengeluaran berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required',
            'keterangan' => 'nullable',
            'nominal' => 'required|integer',
        ]);

        $data = Pengeluaran::create($validated);

        return response()->json([
            'message' => 'Data pengeluaran berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = Pengeluaran::findOrFail($id);

        return response()->json([
            'message' => 'Detail pengeluaran berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = Pengeluaran::findOrFail($id);

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required',
            'keterangan' => 'nullable',
            'nominal' => 'required|integer',
        ]);

        $data->update($validated);

        return response()->json([
            'message' => 'Data pengeluaran berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = Pengeluaran::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data pengeluaran berhasil dihapus'
        ]);
    }
}