<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    use HasFactory;

    protected $fillable = [
        'specialite_id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'numero_ordre',
        'disponibilite',
    ];

    protected $casts = [
        'disponibilite' => 'boolean',
    ];

    public function specialite()
    {
        return $this->belongsTo(Specialite::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}