<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\Kendaraan;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{
    public function index()
    {
        $data = Transaksi::latest()->get();

        return response()->json([
            'message' => 'Data transaksi berhasil diambil',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'nullable|date',
            'no_transaksi' => 'nullable|unique:transaksi,no_transaksi',
            'nama_pelanggan' => 'required',
            'no_telp' => 'nullable',
            'no_polisi' => 'required',
            'merk' => 'nullable',
            'tipe' => 'nullable',
            'jenis_service' => 'required',
            'keluhan' => 'nullable',
            'mekanik' => 'nullable',
            'biaya_jasa' => 'nullable|integer',
            'biaya_sparepart' => 'nullable|integer',
            'status' => 'required',
        ]);

        $biayaJasa = $validated['biaya_jasa'] ?? 0;
        $biayaSparepart = $validated['biaya_sparepart'] ?? 0;

        $data = Transaksi::create([
            'tanggal' => $validated['tanggal'] ?? now()->toDateString(),
            'no_transaksi' => $validated['no_transaksi'] ?? 'TRX-' . time(),
            'nama_pelanggan' => $validated['nama_pelanggan'],
            'no_telp' => $validated['no_telp'] ?? null,
            'no_polisi' => $validated['no_polisi'],
            'merk' => $validated['merk'] ?? null,
            'tipe' => $validated['tipe'] ?? null,
            'jenis_service' => $validated['jenis_service'],
            'keluhan' => $validated['keluhan'] ?? null,
            'mekanik' => $validated['mekanik'] ?? null,
            'biaya_jasa' => $biayaJasa,
            'biaya_sparepart' => $biayaSparepart,
            'total_biaya' => $biayaJasa + $biayaSparepart,
            'status' => $validated['status'],
        ]);

        $pelanggan = Pelanggan::where('no_polisi', $validated['no_polisi'])->first();

        if ($pelanggan) {
            $pelanggan->update([
                'nama' => $validated['nama_pelanggan'],
                'no_telp' => $validated['no_telp'] ?? null,
                'servis_terakhir' => $validated['jenis_service'],
                'jumlah_service' => $pelanggan->jumlah_service + 1,
                'status' => $validated['status'],
            ]);
        } else {
            Pelanggan::create([
                'nama' => $validated['nama_pelanggan'],
                'no_telp' => $validated['no_telp'] ?? null,
                'no_polisi' => $validated['no_polisi'],
                'servis_terakhir' => $validated['jenis_service'],
                'jumlah_service' => 1,
                'status' => $validated['status'],
            ]);
        }

        $kendaraan = Kendaraan::where('plat_nomor', $validated['no_polisi'])->first();

        if ($kendaraan) {
            $kendaraan->update([
                'pemilik' => $validated['nama_pelanggan'],
                'merk' => $validated['merk'] ?? '-',
                'tipe' => $validated['tipe'] ?? '-',
                'servis_terakhir' => $validated['jenis_service'],
                'status' => $validated['status'],
            ]);
        } else {
            Kendaraan::create([
                'plat_nomor' => $validated['no_polisi'],
                'pemilik' => $validated['nama_pelanggan'],
                'merk' => $validated['merk'] ?? '-',
                'tipe' => $validated['tipe'] ?? '-',
                'tahun' => null,
                'warna' => null,
                'servis_terakhir' => $validated['jenis_service'],
                'status' => $validated['status'],
            ]);
        }

        return response()->json([
            'message' => 'Data transaksi berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    public function show($id)
    {
        $data = Transaksi::findOrFail($id);

        return response()->json([
            'message' => 'Detail transaksi berhasil diambil',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = Transaksi::findOrFail($id);

        $validated = $request->validate([
            'tanggal' => 'nullable|date',
            'no_transaksi' => 'required|unique:transaksi,no_transaksi,' . $id,
            'nama_pelanggan' => 'required',
            'no_telp' => 'nullable',
            'no_polisi' => 'required',
            'merk' => 'nullable',
            'tipe' => 'nullable',
            'jenis_service' => 'required',
            'keluhan' => 'nullable',
            'mekanik' => 'nullable',
            'biaya_jasa' => 'nullable|integer',
            'biaya_sparepart' => 'nullable|integer',
            'status' => 'required',
        ]);

        $biayaJasa = $validated['biaya_jasa'] ?? 0;
        $biayaSparepart = $validated['biaya_sparepart'] ?? 0;

        $data->update([
            'tanggal' => $validated['tanggal'] ?? now()->toDateString(),
            'no_transaksi' => $validated['no_transaksi'],
            'nama_pelanggan' => $validated['nama_pelanggan'],
            'no_telp' => $validated['no_telp'] ?? null,
            'no_polisi' => $validated['no_polisi'],
            'merk' => $validated['merk'] ?? null,
            'tipe' => $validated['tipe'] ?? null,
            'jenis_service' => $validated['jenis_service'],
            'keluhan' => $validated['keluhan'] ?? null,
            'mekanik' => $validated['mekanik'] ?? null,
            'biaya_jasa' => $biayaJasa,
            'biaya_sparepart' => $biayaSparepart,
            'total_biaya' => $biayaJasa + $biayaSparepart,
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Data transaksi berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $data = Transaksi::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Data transaksi berhasil dihapus'
        ]);
    }
}