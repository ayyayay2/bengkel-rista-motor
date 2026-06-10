<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;

class KaryawanController extends Controller
{
    public function index()
    {
        $data = Karyawan::latest()->get();

        return response()->json([
            'message' => 'Data karyawan berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'jabatan' => 'required',
            'no_telp' => 'required',
            'status' => 'required',
        ]);

        $data = Karyawan::create($validated);

        return response()->json([
            'message' => 'Data karyawan berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = Karyawan::findOrFail($id);

        return response()->json([
            'message' => 'Detail karyawan berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = Karyawan::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required',
            'jabatan' => 'required',
            'no_telp' => 'required',
            'status' => 'required',
        ]);

        $data->update($validated);

        return response()->json([
            'message' => 'Data karyawan berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = Karyawan::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data karyawan berhasil dihapus'
        ]);
    }
}