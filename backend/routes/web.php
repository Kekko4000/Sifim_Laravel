<?php


use App\Models\ApartmentsView;
use App\Models\ContentsView;
use App\Models\Text;
use App\Models\CategoryView;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\{
     HomeController
};

use App\Http\Controllers\Auth\{
    RegisteredUserController,
    ApartmentController,
    ContentsController,
    TextController,
    CategorieController
};



// ——————————————————————————  
// GENERIC GET  
// ——————————————————————————

Route::get('categories/parentID/{id}', [CategorieController::class, 'parentID'])->name('categories.parentID');
Route::get('contents/parentID/{id}', [ContentsController::class, 'parentID'])->name('contents.parentID');



// ——————————————————————————  
// FRONT-END MULTILINGUA  
// ——————————————————————————
Route::pattern('locale', 'it|en');

Route::middleware(['web', 'setlocale:it'])
     ->name('home.')
     ->group(function () {
          Route::get('/', [HomeController::class, 'index'])->name('it');
          Route::get('/chi-siamo', fn() => Inertia::render('Website/About'))->name('about.it');
          // … altre it …
     });

Route::prefix('en')
     ->middleware(['web', 'setlocale:en'])
     ->name('home.')
     ->group(function () {
          Route::get('/', fn() => Inertia::render('Website/Home'))->name('en');
          Route::get('/about', fn() => Inertia::render('Website/About'))->name('about.en');
          // … altre en …
     });






// ——————————————————————————  
// ADMIN PANEL  
// ——————————————————————————



Route::prefix('admin')
     ->name('admin.')
     ->middleware('web')    // include session, csrf, etc.
     ->group(function () {

          // — guest:admin → login / register
          Route::middleware('guest:admin')->group(function () {
               Route::get('/', fn() => Inertia::render('Admin/Login'))
                    ->name('login');

               Route::get('login', fn() => Inertia::render('Admin/Login'));

               Route::get('register', fn() => Inertia::render('Admin/Register'))
                    ->name('register');

               Route::post('login', [RegisteredUserController::class, 'login'])
                    ->name('login.attempt');

               Route::post('register', [RegisteredUserController::class, 'store'])
                    ->name('register.attempt');
          });

          // — auth:admin → area protetta
          Route::middleware('auth:admin')->group(function () {
               // dashboard
               Route::get('dashboard', fn() => Inertia::render('Admin/Dashboard'))
                    ->name('dashboard');

               // logout
               Route::post('logout', [RegisteredUserController::class, 'logout'])
                    ->name('logout');



               // categorie - se vuoi puoi anche usare resource()
               Route::get('categorie/create', action: function () {
                    Inertia::setRootView('admin');
                    return Inertia::render('categorie/Inserimento');
               })->name('categorie.create');

               Route::get('categorie/cerca', function () {
                    $categorie = CategoryView::all();
                    Inertia::setRootView('admin');
                    return Inertia::render('categorie/cerca', [
                         'categorie' => $categorie,
                    ]);
               })->name('categorie.cerca');

               Route::get('categorie/edit/{id}', function ($id) {
                    $categorie = CategoryView::findOrFail($id);
                    Inertia::setRootView('admin');
                    return Inertia::render('categorie/edit', [
                         'categorie' => $categorie,
                    ]);
               })->name('categorie.edit');

               Route::post('categorie/create', [CategorieController::class, 'store'])
                    ->name('categorie.store');

               Route::post('/categorie/update/{id}', [CategorieController::class, 'update'])
                    ->name('categorie.update');



               // Apartments
               Route::get('apartments/create', action: function () {
                    Inertia::setRootView('admin');
                    return Inertia::render('apartments/crea');
               })->name('apartments.crea');

               Route::get('apartments/search', function () {
                    $apart = ApartmentsView::all();
                    Inertia::setRootView('admin');
                    return Inertia::render('apartments/search', [
                         'apartments' => $apart,
                    ]);
               })->name('apartments.search');

               Route::get('apartments/edit/{id}', function ($id) {
                    $apart = ApartmentsView::findOrFail($id);
                    Inertia::setRootView('admin');
                    return Inertia::render('apartments/edit', [
                         'apartments' => $apart,
                    ]);
               })->name('apartments.edit');

               Route::post('apartments/create', [ApartmentController::class, 'store'])
                    ->name('apartments.create');

               Route::post('/apartments/update/{id}', [ApartmentController::class, 'update'])
                    ->name('apartments.update');



               // TEXTS
               Route::get('texts/create', action: function () {
                    Inertia::setRootView('admin');
                    return Inertia::render('texts/create');
               })->name('texts.create');
               
               Route::get('texts/search', function () {
                    $apart = Text::orderByDesc('id')->get();
                    Inertia::setRootView('admin');
                    return Inertia::render('texts/search', [
                         'texts' => $apart,
                    ]);
               })->name('texts.search');

               Route::get('texts/edit/{id}', function ($id) {
                    $apart = Text::findOrFail($id);
                    Inertia::setRootView('admin');
                    return Inertia::render('texts/edit', [
                         'texts' => $apart,
                    ]);
               })->name('texts.edit');

               Route::post('texts/create', [TextController::class, 'store'])
                    ->name('text.store');

               Route::post('/texts/update/{id}', [TextController::class, 'update'])
                    ->name('texts.update');

               Route::delete('/text/delete/{id}', [TextController::class, 'destroy'])
                    ->name('texts.delete');
     



               //CONTENUTI 
               Route::resource('contents', ContentsController::class)
                 ->except(['show'])
                 ->names([
                     'index'   => 'contents.index',
                     'create'  => 'contents.create',
                     'store'   => 'contents.store',
                     'update'  => 'contents.update',
                     'destroy' => 'contents.delete',
                 ]);



          });
     });
