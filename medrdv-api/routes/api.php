<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\SpecialiteController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\RendezVousController;

Route::apiResource('patients', PatientController::class);
Route::apiResource('specialites', SpecialiteController::class);
Route::apiResource('medecins', MedecinController::class);
Route::apiResource('rendez-vous', RendezVousController::class)
    ->parameters([
        'rendez-vous' => 'rendezVous',
    ]);