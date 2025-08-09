<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        DB::statement(<<<'SQL'
        CREATE OR REPLACE VIEW multi_contents AS
        SELECT
        c.id,
        c.parent_id,
        c.nome,
        c.image,
        c.order,
        c.status,
        c.created_at,
        c.updated_at,
        jsonb_object_agg(lm.language, lm.meta) AS meta
        FROM contents AS c
        JOIN (
        SELECT
            contents_id,
            language,
            jsonb_object_agg(type, text) AS meta
        FROM contents_meta
        GROUP BY contents_id, language
        ) AS lm
        ON lm.contents_id = c.id
        GROUP BY
        c.id, c.parent_id, c.nome, c.image, c.order, c.status, c.created_at, c.updated_at;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS multi_contents;');
    }
};
