<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ContentsView;
use Illuminate\Http\Request;
use App\Models\Contents;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class ContentsController extends Controller
{


    public function index()
    {
        // Prendo tutti i record
        $contents = ContentsView::all();
        // Inertia::render punta al componente React Admin/Contents/Index.jsx
        return Inertia::render('Admin/contents/search', [
            'contents' => $contents,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/contents/create');
    }

    public function edit($id)
    {
        $content = ContentsView::findOrFail($id);
        return Inertia::render('Admin/contents/edit', [
            'contents' => $content,
        ]);
    }


    public function store(Request $request)
    {
        // dd('STORE chiamato – payload:', $request->all());

        DB::transaction(function () use ($request) {
            // 1) Prendo solo i campi generali
            $data = $request->only(['parent_id', 'order', 'enabled']);

            if ($data['parent_id'] === null) {
                $data['parent_id'] = 0;
            }

            $data['nome'] = $request->input('meta.it.title', '');

            // 3) Gestione upload immagine
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('contents', 'public');
            }

            // 4) Creo la categoria con anche 'nome'
            $item = Contents::create($data);

            // 5) Creo i meta solo se hanno name non vuoto
            foreach ($request->input('meta', []) as $lang => $metaData) {
                foreach ($metaData as $type => $text) {
                    $item->metas()->create([
                        'type' => $type,      // es. 'title', 'subtitle', 'slug', ecc.
                        'text' => $text,      // il contenuto vero e proprio
                        'language' => $lang,      // es. 'it', 'en'
                    ]);
                }
            }
        });

        $this->regenerateJson();

        return redirect()
            ->route('admin.contents.create')
            ->with('success', 'Contenuto creato con successo.');
    }

    public function update(Request $request, $id)
    {
        // 1) Definisco le regole (senza validare subito)
        $rules = [
            'parent_id' => 'nullable|integer|exists:contents,id',
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'meta' => 'required|array',
            'meta.*' => 'required|array',
            'meta.*.*' => 'nullable|string',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image';
        }

        // 2) Ora valido **una sola volta** con tutte le regole
        $validated = $request->validate($rules);

        // 3) Preparo i dati generali per l'update
        $data = [
            'parent_id' => $validated['parent_id'] ?? 0,
            'order' => $validated['order'],
            'status' => $validated['status'],
            // il “nome” principale lo prendo dal title italiano
            'nome' => $validated['meta']['it']['title'] ?? null,
        ];

        // 4) Se hai caricato un'immagine, gestisco l'upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('contents', 'public');
        }

        // 5) Transaction per update + ricreazione dei meta
        DB::transaction(function () use ($id, $data, $validated) {
            $content = Contents::findOrFail($id);
            $content->update($data);

            // cancello i meta precedenti
            $content->metas()->delete();

            // ricreo i nuovi meta da $validated['meta']
            $metas = [];
            foreach ($validated['meta'] as $lang => $fields) {
                foreach ($fields as $type => $text) {
                    $metas[] = [
                        'type' => $type,
                        'text' => $text,
                        'language' => $lang,
                    ];
                }
            }
            $content->metas()->createMany($metas);
        });

        $this->regenerateJson();

        // 6) Redirect al listing
        return redirect()
            ->route('admin.contents.index')
            ->with('success', 'Contenuto aggiornato con successo.');
    }



    public function parentID($id)
    {
        // Prendo tutti i record della view
        $all = ContentsView::orderBy('order')->get();
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

    public function destroy($id)
    {
        $content = ContentsView::findOrFail($id);
        $content->delete();

        return redirect()->route('admin.contents.index')
            ->with('success', 'Contenuto eliminato.');
    }


    protected function regenerateJson(): void
    {
        $items = ContentsView::where('status', 1)
            ->get(['id', 'parent_id', 'meta', 'image']);

        $payload = $items->mapWithKeys(function ($row) {
            $meta = is_string($row->meta)
                ? json_decode($row->meta, true)
                : $row->meta;

            // path salvato nel DB (es. "contents/xyz.jpg")
            $imagePath = $row->image;

            // URL pubblico; usa asset() per avere l’URL assoluto
            $imageUrl = $imagePath ? asset('storage/' . $imagePath) : null;
            // in alternativa relativo: Storage::url($imagePath) => "/storage/contents/xyz.jpg"

            return [
                $row->id => [
                    'id' => $row->id,
                    'parentID' => $row->parent_id,
                    'image' => $imagePath, // tieni il path grezzo se ti serve
                    'imageUrl' => $imageUrl,  // comodo per il front-end
                    'meta' => $meta,
                ],
            ];
        })->toArray();

        $dir = resource_path('js/locales');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put(
            "$dir/componenti.json",
            json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }


}
