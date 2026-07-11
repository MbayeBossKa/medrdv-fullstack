<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Liste des patients
     */
    public function index()
    {
        return response()->json(
            Patient::latest()->get()
        );
    }

    /**
     * Créer un patient
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'required|string|max:30',
            'email' => 'nullable|email|unique:patients,email',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:Masculin,Féminin',
            'adresse' => 'nullable|string'
        ]);

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient créé avec succès.',
            'data' => $patient
        ], 201);
    }

    /**
     * Afficher un patient
     */
    public function show(Patient $patient)
    {
        return response()->json($patient);
    }

    /**
     * Modifier un patient
     */
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'required|string|max:30',
            'email' => 'nullable|email|unique:patients,email,' . $patient->id,
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:Masculin,Féminin',
            'adresse' => 'nullable|string'
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient modifié avec succès.',
            'data' => $patient
        ]);
    }

    /**
     * Supprimer un patient
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json([
            'message' => 'Patient supprimé avec succès.'
        ]);
    }
}