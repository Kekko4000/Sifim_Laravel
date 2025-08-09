<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Text;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Http\RedirectResponse;


class TextController extends Controller
{
     public function store(Request $request)
    {
        // 1) valida e prendi i dati validati
        $validated = $this->validateText($request);

        // 2) crea il record
        $text = Text::create($this->mapPayload($validated));

        // 3) rigenera il JSON
        $this->regenerateJson();

        return redirect()
            ->route('admin.texts.create')
            ->with('success', 'Testo creato!');
    }

    // UPDATE
    public function update(Request $request, $id)
{
    // 1) prendi i dati validati
    $validated = $this->validateText($request);

    // 2) carica il record da aggiornare
    $text = Text::findOrFail($id);

    // 3) esegui l’update
    $text->update($this->mapPayload($validated));

    // 4) rigenera il JSON
    $this->regenerateJson();

    // 5) redirect sulla form di modifica di quel record
    return redirect()
        ->route('admin.texts.search')
        ->with('success', 'Testo creato!');
}


    public function destroy(Text $id): RedirectResponse
    {
        // 1) elimina il record
        $id->delete();

        // 2) rigenera il JSON come negli altri metodi
        $this->regenerateJson();

        // 3) torna all’indice
        return redirect()
            ->route('admin.texts.search')
            ->with('success', 'Testo eliminato!');
    }

    // Validazione comune, restituisce array validato
    protected function validateText(Request $request): array
    {
        
        return $request->validate([
            'text.it' => 'required|string',
            'text.en' => 'required|string',
            'status'  => 'required|in:0,1',
        ]);
    }

    // Mappa l'array validato in un array piatto per Eloquent
    protected function mapPayload(array $v): array
    {
    
        return [
            'text_it' => $v['text']['it'],
            'text_en' => $v['text']['en'],
            'status'  => $v['status'],
        ];
    }

    // Rigenera resources/js/locales/testi.json
    protected function regenerateJson(): void
    {
        $payload = Text::where('status', 1)
            ->get(['id','text_it','text_en'])
            ->mapWithKeys(fn($t) => [
                $t->id => ['it' => $t->text_it, 'en' => $t->text_en]
            ])->toArray();

        $dir = resource_path('js/locales');
        if (! File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }
        File::put(
            $dir .'/testi.json',
            json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}
