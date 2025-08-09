<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CategoryView;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $all = CategoryView::orderBy('order')->get();
        $children = $all->where('parent_id', 1)->values();

        return Inertia::render('Website/Home', [
            'tipology' => $children,
        ]);
    }
}
