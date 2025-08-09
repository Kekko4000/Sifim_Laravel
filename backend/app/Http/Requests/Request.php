<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Modifica questa logica se vuoi autorizzare solo alcuni utenti
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        // Aggiungi qui le regole di validazione comuni per tutte le POST
        return [
            // 'field_name' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Custom messages per gli errori di validazione.
     *
     * @return array
     */
    public function messages()
    {
        return [
            // 'field_name.required' => 'Il campo field_name è obbligatorio.',
        ];
    }

    /**
     * Preparazione prima della validazione (opzionale).
     */
    protected function prepareForValidation()
    {
        // Esempio: trim di input comuni
        // $this->merge([
        //     'field_name' => trim($this->field_name),
        // ]);
    }
}
