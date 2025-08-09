<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategorieTable extends Migration
{
    public function up()
    {
        Schema::create('categorie', function (Blueprint $table) {
            $table->id();
            $table->integer('parent_id')
                  ->default(0);
            $table->string('nome')->nullable();
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            // Indice per velocizzare le query sull’albero
            $table->index('parent_id');
        });


        Schema::create('categorie_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categorie_id')
                  ->constrained('categorie')
                  ->onDelete('cascade');
            $table->string('language', 5);
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();

            // Unique per categoria e lingua (evita doppioni)
            $table->unique(['categorie_id', 'language']);
            // Indice per lingua (utile per il lookup)
            $table->index('language');
        });
    }

    public function down()
    {
        Schema::dropIfExists('categorie_meta');
        Schema::dropIfExists('categorie');
    }
}

