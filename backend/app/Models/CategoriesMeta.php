<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriesMeta extends Model
{
    protected $table = 'categorie_meta';

    protected $fillable = [
        'language',
        'name',
        'description',
        'slug',
        'link',
    ];

    public function category()
    {
        return $this->belongsTo(CategoriesMeta::class, 'categorie_id');
    }
}
