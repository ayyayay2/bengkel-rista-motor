<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\Kendaraan;
use App\Models\StokSukuCadang;
use App\Models\TransaksiDetailSparepart;
use Illuminate\Support\Facades\DB;
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
            'status' => 'required',

            'spareparts' => 'nullable|array',
            'spareparts.*.stok_suku_cadang_id' => 'required_with:spareparts|exists:stok_suku_cadang,id',
            'spareparts.*.jumlah' => 'required_with:spareparts|integer|min:1',
        ]);

        try {
            $transaksi = DB::transaction(function () use ($validated) {
                $totalSparepart = 0;

                if (!empty($validated['spareparts'])) {
                    foreach ($validated['spareparts'] as $item) {
                        $stok = StokSukuCadang::findOrFail($item['stok_suku_cadang_id']);

                        if ($stok->stok < $item['jumlah']) {
                            throw new \Exception("Stok {$stok->nama_suku_cadang} tidak cukup. Stok tersedia: {$stok->stok}");
                        }

                        $totalSparepart += $stok->harga * $item['jumlah'];
                    }
                }

                $biayaJasa = $validated['biaya_jasa'] ?? 0;

                $transaksi = Transaksi::create([
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
                    'biaya_sparepart' => $totalSparepart,
                    'total_biaya' => $biayaJasa + $totalSparepart,
                    'status' => $validated['status'],
                ]);

                if (!empty($validated['spareparts'])) {
                    foreach ($validated['spareparts'] as $item) {
                        $stok = StokSukuCadang::findOrFail($item['stok_suku_cadang_id']);
                        $subtotal = $stok->harga * $item['jumlah'];

                        TransaksiDetailSparepart::create([
                            'transaksi_id' => $transaksi->id,
                            'stok_suku_cadang_id' => $stok->id,
                            'nama_suku_cadang' => $stok->nama_suku_cadang,
                            'harga' => $stok->harga,
                            'jumlah' => $item['jumlah'],
                            'subtotal' => $subtotal,
                        ]);

                        $stokBaru = $stok->stok - $item['jumlah'];

                        $stok->update([
                            'stok' => $stokBaru,
                            'status' => $stokBaru <= 0
                                ? 'Habis'
                                : ($stokBaru <= $stok->stok_minimum ? 'Menipis' : 'Tersedia'),
                        ]);
                    }
                }

                Pelanggan::updateOrCreate(
                    ['no_polisi' => $validated['no_polisi']],
                    [
                        'nama' => $validated['nama_pelanggan'],
                        'no_telp' => $validated['no_telp'] ?? null,
                        'servis_terakhir' => $validated['jenis_service'],
                        'jumlah_service' => 1,
                        'status' => $validated['status'],
                    ]
                );

                Kendaraan::updateOrCreate(
                    ['plat_nomor' => $validated['no_polisi']],
                    [
                        'pemilik' => $validated['nama_pelanggan'],
                        'merk' => $validated['merk'] ?? '-',
                        'tipe' => $validated['tipe'] ?? '-',
                        'servis_terakhir' => $validated['jenis_service'],
                        'status' => $validated['status'],
                    ]
                );

                return $transaksi;
            });

            return response()->json([
                'message' => 'Data transaksi berhasil ditambahkan',
                'data' => $transaksi
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
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
            'no_transaksi' => 'nullable|unique:transaksi,no_transaksi,' . $id,
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
            'tanggal' => $validated['tanggal'] ?? $data->tanggal,
            'no_transaksi' => $validated['no_transaksi'] ?? $data->no_transaksi,
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

        Pelanggan::updateOrCreate(
            ['no_polisi' => $validated['no_polisi']],
            [
                'nama' => $validated['nama_pelanggan'],
                'no_telp' => $validated['no_telp'] ?? null,
                'servis_terakhir' => $validated['jenis_service'],
                'status' => $validated['status'],
            ]
        );

        Kendaraan::updateOrCreate(
            ['plat_nomor' => $validated['no_polisi']],
            [
                'pemilik' => $validated['nama_pelanggan'],
                'merk' => $validated['merk'] ?? '-',
                'tipe' => $validated['tipe'] ?? '-',
                'servis_terakhir' => $validated['jenis_service'],
                'status' => $validated['status'],
            ]
        );

        return response()->json([
            'message' => 'Data transaksi berhasil diperbarui',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $noPolisi = $transaksi->no_polisi;

        $transaksi->delete();

        $masihAdaTransaksi = Transaksi::where('no_polisi', $noPolisi)->exists();

        if (!$masihAdaTransaksi) {
            Pelanggan::where('no_polisi', $noPolisi)->delete();
            Kendaraan::where('plat_nomor', $noPolisi)->delete();
        }

        return response()->json([
            'message' => 'Data transaksi berhasil dihapus'
        ]);
    }
}