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
        // appartamenti
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();
            $table->integer('typology');
            $table->integer('contract');
            $table->decimal('price', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->string('address');
            $table->string('postal_code', 10);
            $table->string('city');
            $table->string('province', 2);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedTinyInteger('rooms') -> nullable();
            $table->unsignedTinyInteger('bedrooms') -> nullable();
            $table->unsignedTinyInteger('bathrooms') -> nullable();
            $table->unsignedSmallInteger('area_sqm') -> nullable();
            $table->integer('floor')->default(0);
            $table->integer('total_floors')->nullable();
            $table->string('energy_class', 10)->nullable();
            $table->string('heating_type', 50)->nullable();
            $table->decimal('condo_fees', 8, 2)->nullable();
            $table->unsignedTinyInteger('parking_spaces')->default(0);
            $table->boolean('has_garden')->default(false);
            $table->unsignedSmallInteger('garden_area_sqm')->nullable();
            $table->boolean('has_terrace')->default(false);
            $table->unsignedSmallInteger('terrace_area_sqm')->nullable();
            $table->boolean('has_balcony')->default(false);
            $table->boolean('has_elevator')->default(false);
            $table->boolean('is_furnished')->default(false);
            $table->boolean('has_pool')->default(false);
            $table->string('image')->nullable();
            $table->string('image_cover')->nullable();
            $table->date('availability_date')->nullable();
            $table->boolean('status')->default(0);
            $table->timestamps();
        });

        // appartamenti_meta
        Schema::create('apartments_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apartments_id')->constrained('apartments')->onDelete('cascade');
            $table->string('language', 5);
            $table->string('title');
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->text('place')->nullable();
            $table->text('other')->nullable();
            $table->unique(['apartments_id', 'language']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments_meta');
        Schema::dropIfExists('apartments');
    }
};
