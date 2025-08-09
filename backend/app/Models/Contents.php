<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contents extends Model
{
    protected $table = 'contents';

    protected $guarded = ['id'];

    public function metas()
    {
        return $this->hasMany(ContentsMeta::class, 'contents_id');
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
