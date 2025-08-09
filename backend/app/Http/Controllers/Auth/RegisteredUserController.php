<?php 

// app/Http/Controllers/Auth/RegisteredUserController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request)
    {
        // dd('STORE chiamato – payload:', $request->all());
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::guard('admin')->login($user);

        return redirect()->intended(default: route('admin.dashboard'));
        // return Inertia::render('Admin/Login'); // cambia con la tua route post-login
    }


    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            return redirect()->intended(route('admin.dashboard'));
        }
        return back()->withErrors(['email' => 'Credenziali non valide']);
    }

    public function logout(Request $request)
    {
        // 1) Logout dal guard “admin”
        Auth::guard('admin')->logout();

        // 2) Invalidazione della sessione
        $request->session()->invalidate();

        // 3) Rigenerazione del token CSRF
        $request->session()->regenerateToken();

        // 4) Redirect al login admin
        return redirect()->route('admin.login');
    }

}
