<?php

namespace App\Http\Controllers;

use App\Models\Medecin;
use Illuminate\Http\Request;

class MedecinController extends Controller
{
    public function index()
    {
        $medecins = Medecin::with('specialite')
            ->latest()
            ->get();

        return response()->json($medecins);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'specialite_id' => 'required|exists:specialites,id',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'nullable|string|max:30',
            'email' => 'nullable|email|unique:medecins,email',
            'numero_ordre' => 'nullable|string|max:100|unique:medecins,numero_ordre',
            'disponibilite' => 'required|boolean',
        ]);

        $medecin = Medecin::create($validated);
        $medecin->load('specialite');

        return response()->json([
            'message' => 'Médecin créé avec succès.',
            'data' => $medecin,
        ], 201);
    }

    public function show(Medecin $medecin)
    {
        $medecin->load('specialite');

        return response()->json($medecin);
    }

    public function update(Request $request, Medecin $medecin)
    {
        $validated = $request->validate([
            'specialite_id' => 'required|exists:specialites,id',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'nullable|string|max:30',
            'email' => 'nullable|email|unique:medecins,email,' . $medecin->id,
            'numero_ordre' => 'nullable|string|max:100|unique:medecins,numero_ordre,' . $medecin->id,
            'disponibilite' => 'required|boolean',
        ]);

        $medecin->update($validated);
        $medecin->load('specialite');

        return response()->json([
            'message' => 'Médecin modifié avec succès.',
            'data' => $medecin,
        ]);
    }

    public function destroy(Medecin $medecin)
    {
        $medecin->delete();

        return response()->json([
            'message' => 'Médecin supprimé avec succès.',
        ]);
    }
}