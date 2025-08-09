<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CategoryView;
use Illuminate\Http\Request;
use App\Models\Categories;
use Illuminate\Support\Facades\DB;

class CategorieController extends Controller
{



    public function store(Request $request)
    {
        // dd('STORE chiamato – payload:', $request->all());

        DB::transaction(function () use ($request) {
            // 1) Prendo solo i campi generali
            $data = $request->only(['parent_id', 'order', 'enabled']);

            if ($data['parent_id'] === null) {
                $data['parent_id'] = 0;
            }

            // 2) Estraggo il nome in italiano dal meta
            //    se non è presente, lo imposto a stringa vuota o null
            $data['nome'] = $request->input('meta.it.name', '');

            // 3) Gestione upload immagine
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('categories', 'public');
            }

            // 4) Creo la categoria con anche 'nome'
            $category = Categories::create($data);

            // 5) Creo i meta solo se hanno name non vuoto
            foreach ($request->input('meta', []) as $lang => $metaData) {
                if (empty($metaData['name']) || trim($metaData['name']) === '') {
                    continue;
                }
                $category->metas()->create($metaData);
            }
        });

        return redirect()
            ->route('admin.categorie.create')
            ->with('success', 'Categoria creata con successo.');
    }


    public function update(Request $request, $id)
    {
        DB::enableQueryLog();

        try {
            DB::transaction(function () use ($request, $id) {
                // 1) Prendo solo i campi generali (con default su parent_id)
                $data = $request->only(['parent_id', 'order', 'enabled']);
                $data['parent_id'] = $data['parent_id'] ?? 0;

                // 2) Estraggo il nome in italiano dal meta
                $data['nome'] = $request->input('meta.it.name', '');

                // 3) Gestione upload immagine (se presente)
                if ($request->hasFile('image')) {
                    $data['image'] = $request->file('image')
                        ->store('categories', 'public');
                }

                // 4) **Recupero** il record esistente
                $category = Categories::findOrFail($id);

                // 5) **Aggiorno** la categoria
                $category->update($data);

                // 6) Elimino tutti i meta precedenti
                $category->metas()->delete();

                // 7) Ricreo i meta da request
                foreach ($request->input('meta', []) as $lang => $metaData) {
                    if (empty($metaData['name']) || trim($metaData['name']) === '') {
                        continue;
                    }
                    $category->metas()->create($metaData);
                }
            });
        } catch (\Throwable $e) {
            // Se qualcosa va storto, dump delle query e del messaggio
            dd([
                'queries' => DB::getQueryLog(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]); 
        }

        return redirect()
            ->route('admin.categorie.edit', $id)
            ->with('success', 'Categoria aggiornato con successo.');
    }



    public function parentID($id)
    {
        // Prendo tutti i record della view
        $all = CategoryView::orderBy('order')->get();


        if ((int) $id === 0) {
            $tree = $this->buildTree($all);
            return response()->json($tree);
        }

        // Altrimenti filtro solo i figli diretti
        $children = $all->where('parent_id', (int) $id)->values();
        return response()->json($children);
    }

    private function buildTree($elements, $parentId = 0)
    {
        $branch = [];
        foreach ($elements as $el) {
            if ($el->parent_id === $parentId) {
                // Trovo i figli dell'elemento corrente
                $children = $this->buildTree($elements, $el->id);
                if ($children->isNotEmpty()) {
                    // Aggiungo un attributo 'children' nell'oggetto
                    $el->children = $children;
                }
                $branch[] = $el;
            }
        }

        return collect($branch);
    }

}
