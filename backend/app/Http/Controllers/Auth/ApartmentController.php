<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Apartments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver; // o Imagick se lo usi
use Illuminate\Support\Facades\Storage;


class ApartmentController extends Controller
{
    public function store(Request $request)
    {
        // dd('STORE chiamato – payload:', $request->all());
        DB::enableQueryLog();

        try {
            DB::transaction(function () use ($request) {
                // 1) Prendo solo i campi generali
                $data = $request->validate([
                    'typology' => 'nullable|integer',
                    'contract' => 'nullable|integer',
                    'price' => 'nullable|numeric',
                    'currency' => 'nullable|string|size:3',
                    'address' => 'nullable|string',
                    'postal_code' => 'nullable|string|max:10',
                    'city' => 'nullable|string',
                    'province' => 'nullable|string|size:2',
                    'region' => 'nullable|string',
                    'latitude' => 'nullable|numeric',
                    'longitude' => 'nullable|numeric',
                    'rooms' => 'nullable|integer',
                    'bedrooms' => 'nullable|integer',
                    'bathrooms' => 'nullable|integer',
                    'area_sqm' => 'nullable|integer',
                    'floor' => 'nullable|integer',
                    'total_floors' => 'nullable|integer',
                    'energy_class' => 'nullable|string|max:10',
                    'heating_type' => 'nullable|string|max:50',
                    'condo_fees' => 'nullable|numeric',
                    'parking_spaces' => 'nullable|integer',
                    'has_garden' => 'nullable|boolean',
                    'garden_area_sqm' => 'nullable|integer',
                    'has_terrace' => 'nullable|boolean',
                    'terrace_area_sqm' => 'nullable|integer',
                    'has_balcony' => 'nullable|boolean',
                    'has_elevator' => 'nullable|boolean',
                    'is_furnished' => 'nullable|boolean',
                    'has_pool' => 'nullable|boolean',
                    'availability_date' => 'nullable|date',
                    'status' => 'nullable|boolean',
                    'image' => 'nullable|image|max:2048',
                ]);

                // 2) Estraggo il nome in italiano dal meta
                //    se non è presente, lo imposto a stringa vuota o null
                $data['nome'] = $request->input('meta.it.name', '');

                $disk = app()->environment('public') ? Storage::disk('s3') : Storage::disk('public');

                // 3) Gestione upload immagine
                if ($request->hasFile('image')) {
                    $manager = new ImageManager(new Driver());

                    // 1) salva l’originale (con visibilità pubblica)
                    // - se usi sempre S3 puoi fare direttamente: Storage::disk('s3')->putFile(...)
                    $originalPath = $request->file('image')->store(
                        'apartments/original',
                        ['disk' => app()->environment('production') ? 's3' : 'public', 'visibility' => 'public']
                    );

                    // 2) leggi e orienta
                    $img = $manager->read($request->file('image')->getRealPath())->orient();

                    // 3) cover ridotta
                    $imgSmall = (clone $img)->scaleDown(width: 400, height: 400);

                    // 4) codifica webp (leggera)
                    $bytes = $imgSmall->toWebp(quality: 80);

                    // 5) salva la cover (public + headers utili)
                    $name = pathinfo($request->file('image')->hashName(), PATHINFO_FILENAME) . '.webp';
                    $coverPath = "apartments/covers/{$name}";

                    $disk->put($coverPath, (string) $bytes, [
                        'visibility'    => 'public',
                        'CacheControl'  => 'public, max-age=31536000, immutable',
                        'ContentType'   => 'image/webp',
                    ]);

                    // 6) salva le chiavi (path) nel DB
                    $data['image'] = $originalPath;     // es: apartments/original/xxxx.jpg
                    $data['image_cover'] = $coverPath;  // es: apartments/covers/xxxx.webp
                }


                // 4) Creo la categoria con anche 'nome'
                try {
                    $apartment = Apartments::create($data);
                    // 5) Creo i meta solo se hanno name non vuoto

                    foreach ($request->input('meta', []) as $lang => $metaData) {
                        if (empty($metaData['title']) || trim($metaData['title']) === '') {
                            continue;
                        }
                        $apartment->metas()->create($metaData);
                    }
                } catch (\Throwable $e) {
                    // dump delle query fino a questo punto
                    dd([
                        'query_log' => DB::getQueryLog(),
                        'error_message' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }

            });
        } catch (\Throwable $outer) {
            throw $outer;
        }


        return redirect()
            ->route('admin.apartments.create')
            ->with('success', 'Appartamento creato con successo.');
    }


    public function update(Request $request, $id)
    {
        DB::enableQueryLog();
        try {
            DB::transaction(function () use ($request, $id) {
                // 1) Recupera l'appartamento o 404
                $apartment = Apartments::findOrFail($id);
               
                // 2) Valida i campi "generali"
                $data = $request->validate([
                    'typology' => 'nullable|integer',
                    'contract' => 'nullable|integer',
                    'price' => 'nullable|numeric',
                    'currency' => 'nullable|string|size:3',
                    'address' => 'nullable|string',
                    'postal_code' => 'nullable|string|max:10',
                    'city' => 'nullable|string',
                    'province' => 'nullable|string|size:2',
                    'latitude' => 'nullable|numeric',
                    'longitude' => 'nullable|numeric',
                    'rooms' => 'nullable|integer',
                    'bedrooms' => 'nullable|integer',
                    'bathrooms' => 'nullable|integer',
                    'area_sqm' => 'nullable|integer',
                    'floor' => 'nullable|integer',
                    'total_floors' => 'nullable|integer',
                    'energy_class' => 'nullable|string|max:10',
                    'heating_type' => 'nullable|string|max:50',
                    'condo_fees' => 'nullable|numeric',
                    'parking_spaces' => 'nullable|integer',
                    'has_garden' => 'nullable|boolean',
                    'garden_area_sqm' => 'nullable|integer',
                    'has_terrace' => 'nullable|boolean',
                    'terrace_area_sqm' => 'nullable|integer',
                    'has_balcony' => 'nullable|boolean',
                    'has_elevator' => 'nullable|boolean',
                    'is_furnished' => 'nullable|boolean',
                    'has_pool' => 'nullable|boolean',
                    'availability_date' => 'nullable|date',
                    'status' => 'nullable|boolean',
                    'image' => 'nullable|image|max:2048',
                ]);

                 
                // 3) Se c'è un file immagine, gestiscilo
                 $disk = app()->environment('public') ? Storage::disk('s3') : Storage::disk('public');

                // 3) Gestione upload immagine
                if ($request->hasFile('image')) {
                    $manager = new ImageManager(new Driver());

                    // 1) salva l’originale (con visibilità pubblica)
                    // - se usi sempre S3 puoi fare direttamente: Storage::disk('s3')->putFile(...)
                    $originalPath = $request->file('image')->store(
                        'apartments/original',
                        ['disk' => app()->environment('production') ? 's3' : 'public', 'visibility' => 'public']
                    );

                    // 2) leggi e orienta
                    $img = $manager->read($request->file('image')->getRealPath())->orient();

                    // 3) cover ridotta
                    $imgSmall = (clone $img)->scaleDown(width: 400, height: 400);

                    // 4) codifica webp (leggera)
                    $bytes = $imgSmall->toWebp(quality: 80);

                    // 5) salva la cover (public + headers utili)
                    $name = pathinfo($request->file('image')->hashName(), PATHINFO_FILENAME) . '.webp';
                    $coverPath = "apartments/covers/{$name}";

                    $disk->put($coverPath, (string) $bytes, [
                        'visibility'    => 'public',
                        'CacheControl'  => 'public, max-age=31536000, immutable',
                        'ContentType'   => 'image/webp',
                    ]);

                    // 6) salva le chiavi (path) nel DB
                    $data['image'] = $originalPath;     // es: apartments/original/xxxx.jpg
                    $data['image_cover'] = $coverPath;  // es: apartments/covers/xxxx.webp
                }

                // 4) Aggiorna l'appartamento
                $apartment->update($data);

                // 5) Elimina i meta precedenti
                $apartment->metas()->delete();

                // 6) Ricrea i meta da request
                foreach ($request->input('meta', []) as $lang => $metaData) {
                    if (empty($metaData['title']) || trim($metaData['title']) === '') {
                        continue;
                    }
                    $apartment->metas()->create($metaData);
                }
            });
        } catch (\Throwable $e) {
            // In caso di errore, dump delle query e del messaggio
            dd([
                'queries' => DB::getQueryLog(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return redirect()
            ->route('admin.apartments.edit', $id)
            ->with('success', 'Appartamento aggiornato con successo.');
    }



}
