<?php

namespace App\Http\Controllers;

use App\Models\Specialite;
use Illuminate\Http\Request;

class SpecialiteController extends Controller
{
    public function index()
    {
        return response()->json(
            Specialite::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:specialites,nom',
            'description' => 'nullable|string'
        ]);

        $specialite = Specialite::create($validated);

        return response()->json([
            'message' => 'Spécialité créée avec succès.',
            'data' => $specialite
        ], 201);
    }

    public function show(Specialite $specialite)
    {
        return response()->json($specialite);
    }

    public function update(Request $request, Specialite $specialite)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:specialites,nom,' . $specialite->id,
            'description' => 'nullable|string'
        ]);

        $specialite->update($validated);

        return response()->json([
            'message' => 'Spécialité modifiée avec succès.',
            'data' => $specialite
        ]);
    }

    public function destroy(Specialite $specialite)
    {
        $specialite->delete();

        return response()->json([
            'message' => 'Spécialité supprimée avec succès.'
        ]);
    }
}