import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Form({
    languages = ['it', 'en'],
    onSubmitUrl = '/admin/texts/create',
    existingData = null,
    params = 'add'
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        text: {
            it: existingData?.text_it || '',
            en: existingData?.text_en || '',
        },
        status: existingData?.status ?? 1,
    });
    const [activeLang, setActiveLang] = useState(languages[0]);

    function submit(e) {
        e.preventDefault();
        // se esiste existingData fai put, altrimenti post
        post(onSubmitUrl, { forceFormData: true, preserveScroll: true ,
                    // *** Callback di successo ***
        onSuccess: (page) => {
            const url = new URL(window.location.href);
            url.searchParams.set(params, 'ok');
            window.location.href = url.toString();
        },

        // *** Callback di errore ***
        onError: (errors) => {
            alert(
                '❌ Errore di validazione:\n' +
                JSON.stringify(errors, null, 2)
            )
        },
    });

    }

    return (
        <form onSubmit={submit} className="space-y-6 p-6 bg-white rounded shadow">
            <div className="flex space-x-2">
                {languages.map(lang => (
                    <button

                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        style={{width:'40px', height:'40px'}}
                        className={(activeLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-200')}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
            <div>
                <label>Testo ({activeLang})</label>
                <textarea
                    value={data.text[activeLang]}
                    rows={4}
                    onChange={e => setData('text', {
                        ...data.text,
                        [activeLang]: e.target.value
                    })}
                    className="mt-1 block w-full border rounded p-2"
                />
                {errors[`text.${activeLang}`] && (
                    <div className="text-red-600 text-sm">
                        {errors[`text.${activeLang}`]}
                    </div>
                )}
            </div>


            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="status"
                    checked={data.status}
                    onChange={e => setData('status', e.target.checked ? 1 : 0)}
                    className="h-4 w-4"
                />
                <label className="text-sm">Abilitato</label>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-blue-600 text-white rounded"
            >
                {processing ? 'Salvataggio…' : 'Salva'}
            </button>
        </form>
    );
}
