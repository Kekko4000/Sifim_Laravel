<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apartments extends Model
{
    protected $table = 'apartments';

    // ti permette di mass-assignare ogni colonna, tranne quelle che elenchi qui
    protected $guarded = ['id'];

    public function metas()
    {
        return $this->hasMany(ApartmentsMeta::class, 'apartments_id');
    }

}
