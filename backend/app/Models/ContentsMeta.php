<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentsMeta extends Model
{
    protected $table = 'contents_meta';
    public $timestamps = false;
    protected $guarded = ['id'];

    public function contents()
    {
        return $this->belongsTo(ContentsMeta::class, 'contents_id');
    }
}
