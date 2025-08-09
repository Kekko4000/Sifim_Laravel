<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApartmentsMeta extends Model
{
    protected $table = 'apartments_meta';
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = [
        'language',
        'title',
        'description',
        'place',
        'other',
        'apartments_id', // se esiste relazione
    ];
}
