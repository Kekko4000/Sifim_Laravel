<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApartmentsView extends Model
{
    // Nome esatto della view
    protected $table = 'multi_apartments';

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
