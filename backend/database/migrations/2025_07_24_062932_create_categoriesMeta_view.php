<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateCategoriesMetaView extends Migration
{
    public function up()
    {
        DB::statement(<<<'SQL'
            CREATE OR REPLACE VIEW multi_categorie AS
            SELECT
            c.id,
            c.parent_id,
            c.nome,
            c.image,
            c.order,
            c.enabled,
            c.created_at,
            c.updated_at,
            (
                SELECT jsonb_object_agg(
                cm.language,
                jsonb_strip_nulls(jsonb_build_object(
                    'name', cm.name,
                    'slug', cm.slug,
                    'description', cm.description,
                    'link', cm.link
                ))
                )
                FROM categorie_meta cm
                WHERE cm.categorie_id = c.id
            ) AS meta
            FROM categorie c;
        SQL);
    }


    public function down()
    {
        DB::statement('DROP VIEW IF EXISTS multi_categorie;');
    }
}
