<?php 

namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Closure;

class SetLocale
{
    public function handle(Request $request, Closure $next, ?string $forced = null)
    {
        $locale = $forced ?? 'it'; // se forzato, usa quello; altrimenti default it
        app()->setLocale($locale);
        inertia()->share('locale', $locale);

        return $next($request);
    }
}