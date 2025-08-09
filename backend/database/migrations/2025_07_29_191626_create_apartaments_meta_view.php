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
        DB::statement(<<<'SQL'
            CREATE OR REPLACE VIEW multi_apartments  AS
            SELECT
            a.id,
            a.contract,
            a.price,
            a.currency,
            a.address,
            a.postal_code,
            a.city,
            a.province,
            a.latitude,
            a.longitude,
            a.rooms,
            a.bedrooms,
            a.bathrooms,
            a.area_sqm,
            a.floor,
            a.total_floors,
            a.energy_class,
            a.heating_type,
            a.condo_fees,
            a.parking_spaces,
            a.has_garden,
            a.garden_area_sqm,
            a.has_terrace,
            a.terrace_area_sqm,
            a.has_balcony,
            a.has_elevator,
            a.is_furnished,
            a.has_pool,
            a.availability_date,
            a.status,
            a.created_at,
            a.updated_at,
            jsonb_build_object(
                'id', mc.id,
                'meta', coalesce(mc.meta, '{}'::jsonb)
                ) AS typology,
            ( SELECT jsonb_object_agg(am.language, jsonb_strip_nulls(jsonb_build_object('title', am.title, 'description', am.description, 'place', am.place, 'other', am.other))) AS jsonb_object_agg
                FROM apartments_meta am
                WHERE am.apartments_id = a.id) AS meta
            FROM apartments a
                    LEFT JOIN multi_categorie mc ON mc.id = a.typology;
                    
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('multi_apartments');
    }
};
