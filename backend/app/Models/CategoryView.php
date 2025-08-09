<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryView extends Model
{
    // Nome esatto della view
    protected $table = 'multi_categorie';

    // La PK esiste ma non è autoincrement
    protected $primaryKey = 'id';
    public $incrementing = false;

    // Nella view non vogliamo Eloquent timestamps automatici
    public $timestamps = false;

    // Cast del campo JSON 'meta' a array PHP
    protected $casts = [
        'meta' => 'array',
    ];
}
