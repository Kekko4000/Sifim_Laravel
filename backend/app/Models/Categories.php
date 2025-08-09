<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categorie';

    protected $fillable = [
        'parent_id',
        'nome',
        'image',
        'order',
        'enabled',
    ];

    public function metas()
    {
        return $this->hasMany(CategoriesMeta::class, 'categorie_id');
    }


    // figli diretti
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    // figli ricorsivi (figli, nipoti, pronipoti…)
    public function childrenRecursive()
    {
        return $this->children()
                    ->with(['childrenRecursive', 'metas']);
    }

}
