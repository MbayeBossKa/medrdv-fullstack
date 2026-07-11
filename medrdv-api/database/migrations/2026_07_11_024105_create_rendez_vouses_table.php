<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('rendez_vous', function (Blueprint $table) {

        $table->id();

        $table->foreignId('patient_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->foreignId('medecin_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->date('date_rendez_vous');

        $table->time('heure_rendez_vous');

        $table->text('motif');

        $table->enum('statut', [
            'programmé',
            'confirmé',
            'terminé',
            'annulé'
        ])->default('programmé');

        $table->text('observations')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vouses');
    }
};
