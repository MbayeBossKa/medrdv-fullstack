<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RendezVousController extends Controller
{
    public function index(Request $request)
    {
        $query = RendezVous::with([
            'patient',
            'medecin.specialite'
        ]);

        if ($request->filled('date')) {
            $query->whereDate('date_rendez_vous', $request->date);
        }

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->filled('medecin_id')) {
            $query->where('medecin_id', $request->medecin_id);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $rendezVous = $query
            ->orderBy('date_rendez_vous')
            ->orderBy('heure_rendez_vous')
            ->get();

        return response()->json($rendezVous);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:medecins,id',
            'date_rendez_vous' => 'required|date|after_or_equal:today',
            'heure_rendez_vous' => [
                'required',
                'date_format:H:i',
                Rule::unique('rendez_vous')
                    ->where(function ($query) use ($request) {
                        return $query
                            ->where('medecin_id', $request->medecin_id)
                            ->where('date_rendez_vous', $request->date_rendez_vous);
                    }),
            ],
            'motif' => 'required|string|max:500',
            'statut' => 'required|in:programmé,confirmé,terminé,annulé',
            'observations' => 'nullable|string|max:1000',
        ], [
            'heure_rendez_vous.unique' =>
                'Ce médecin possède déjà un rendez-vous à cette date et à cette heure.',
        ]);

        $rendezVous = RendezVous::create($validated);

        $rendezVous->load([
            'patient',
            'medecin.specialite'
        ]);

        return response()->json([
            'message' => 'Rendez-vous créé avec succès.',
            'data' => $rendezVous,
        ], 201);
    }

    public function show(RendezVous $rendezVous)
    {
        $rendezVous->load([
            'patient',
            'medecin.specialite'
        ]);

        return response()->json($rendezVous);
    }

    public function update(Request $request, RendezVous $rendezVous)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:medecins,id',
            'date_rendez_vous' => 'required|date',
            'heure_rendez_vous' => [
                'required',
                'date_format:H:i',
                Rule::unique('rendez_vous')
                    ->ignore($rendezVous->id)
                    ->where(function ($query) use ($request) {
                        return $query
                            ->where('medecin_id', $request->medecin_id)
                            ->where('date_rendez_vous', $request->date_rendez_vous);
                    }),
            ],
            'motif' => 'required|string|max:500',
            'statut' => 'required|in:programmé,confirmé,terminé,annulé',
            'observations' => 'nullable|string|max:1000',
        ], [
            'heure_rendez_vous.unique' =>
                'Ce médecin possède déjà un rendez-vous à cette date et à cette heure.',
        ]);

        $rendezVous->update($validated);

        $rendezVous->load([
            'patient',
            'medecin.specialite'
        ]);

        return response()->json([
            'message' => 'Rendez-vous modifié avec succès.',
            'data' => $rendezVous,
        ]);
    }

    public function destroy(RendezVous $rendezVous)
    {
        $rendezVous->delete();

        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès.',
        ]);
    }
}