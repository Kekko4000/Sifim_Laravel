<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->integer('parent_id')
                ->default(0);
            $table->string('nome')->nullable();
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
            // Indice per velocizzare le query sull’albero
            $table->index('parent_id');
        });


        Schema::create('contents_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contents_id')
                ->constrained('contents')
                ->onDelete('cascade');
            $table->string('type');
            $table->text('text')->nullable();
            $table->string('language', 5);
            // Unique per contents e lingua (evita doppioni)
            $table->unique(['contents_id', 'type', 'language']);
            // Indice per lingua (utile per il lookup)
            $table->index('language');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents_meta');
        Schema::dropIfExists('contents');
    }
};
