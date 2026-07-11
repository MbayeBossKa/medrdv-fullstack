<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'date_naissance',
        'sexe',
        'adresse',
    ];

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}