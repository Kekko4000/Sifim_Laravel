import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { useMultiCategories } from '@/Hook/Post/Generic';
import { flattenCategoriesWithDepth } from '@/Utils/form'


export default function Form({
    languages = ['it', 'en'],
    onSubmitUrl = '/admin/contents/create',
    existingData = null,
    params = 'add',
    title = ''
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        parent_id: existingData?.parent_id || '',
        status: existingData?.status ?? 0,
        image: existingData?.image ?? 0,
        order: existingData?.order ?? 1,
        meta: languages.reduce((acc, lang) => {
            acc[lang] = {
                language: lang,
                title: existingData?.meta?.[lang]?.title || '',
                subtitle: existingData?.meta?.[lang]?.subtitle || '',
                description: existingData?.meta?.[lang]?.description || '',
                slug: existingData?.meta?.[lang]?.slug || '',
                link: existingData?.meta?.[lang]?.link || '',
                other: existingData?.meta?.[lang]?.other || '',
            };
            return acc;
        }, {}),
    });

    console.log(existingData);
    const [activeLang, setActiveLang] = useState(languages[0]);
    const [categories] = useMultiCategories(0, 'contents');
    const flatCats = flattenCategoriesWithDepth(categories)


    // 4) Gestori di campo
    const handleChange = (field) => (e) => {
        const value =
            field === 'image'
                ? e.target.files[0]
                : e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value;
        setData(field, value);
    };

    const generateSlug = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');


    const handleMetaChange = (field) => (e) => {
        const v = e.target.value
        setData(`meta.${activeLang}.${field}`, v)
        if (field === 'title') {
            setData(
                `meta.${activeLang}.slug`,
                generateSlug(v)
            )
        }
    }



    function submit(e) {
        e.preventDefault();
        // se esiste existingData fai put, altrimenti post
        if (!existingData) {
            post(onSubmitUrl, {
                forceFormData: true, preserveScroll: true,
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
        } else {
            put(
                `/admin/contents/${existingData.id}`, 
                {
                preserveScroll: true,
                onSuccess: () => {
                    const url = new URL(window.location.href);
                    url.searchParams.set(params, 'ok');
                    window.location.href = url.toString();
                },
                onError: errs => alert('Errore:\n' + JSON.stringify(errs, null, 2)),
                }
            );
        }
    }



    return (
        <>
            <div className='w-full flex justify-between p-6'>
                <h1 className='text-xl font-bold mb-4'>{title.toUpperCase()}</h1>
                <Link className='btn-default' href={'/admin/contents'} >Torna alla Ricerca</Link>
            </div>
            <form
                onSubmit={submit}
                encType="multipart/form-data"
                className="space-y-6 p-6 bg-white rounded-lg shadow-md"
            >

                <div>
                    <div>
                        <label className="block text-sm font-medium">Genitore ID</label>
                        <select
                            name="parent_id"
                            value={data.parent_id}
                            onChange={e => setData('parent_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring"
                        >
                            <option value="0">-- Nessuno --</option>
                            {flatCats.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {/* inserisco tanti spazi " " quanta è la profondità */}
                                    {Array(item.depth).fill('  ').join('')}{item.name}
                                </option>
                            ))}
                        </select>
                        {errors.parent_id && (
                            <div className="text-red-600 text-sm">{errors.parent_id}</div>
                        )}
                    </div>
                </div>

                {/* Sezione Traduzioni */}
                <div className="border-t pt-4">
                    <h3 className="text-xl font-medium mb-4">Multilingua</h3>

                    {/* Tab Lingue */}
                    <div className="flex space-x-2 mb-6">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setActiveLang(lang)}
                                className={`px-3 py-1 rounded  cursor-pointer ${activeLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Campi per la lingua selezionata */}
                    <div className="space-y-4">
                        {['title', 'subtitle', 'description', 'link', 'other'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium">
                                    {field.charAt(0).toUpperCase() + field.slice(1)} (
                                    {activeLang})
                                </label>
                                {field === 'description' ||
                                    field === 'place' ||
                                    field === 'other' ? (
                                    <textarea
                                        name={`meta[${activeLang}].${field}`}
                                        value={data.meta[activeLang][field]}
                                        onChange={handleMetaChange(field)}
                                        rows={field === 'description' ? 3 : 2}
                                        className="mt-1 block w-full border rounded p-2"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={`meta[${activeLang}].${field}`}
                                        value={data.meta[activeLang][field]}
                                        onChange={handleMetaChange(field)}
                                        className="mt-1 block w-full border rounded p-2"
                                    />
                                )}
                                {errors[`meta.${activeLang}.${field}`] && (
                                    <div className="text-red-600 text-sm">
                                        {errors[`meta.${activeLang}.${field}`]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sezione Generale */}
                <div className="grid grid-cols-1 gap-4">

                    <div>
                        <label className="block text-sm font-medium">Immagine</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange('image')}
                            className="mt-1 block w-full text-sm text-gray-500"
                        />
                        {errors.image && (
                            <div className="text-red-600 text-sm">{errors.image}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Order</label>
                        <input
                            type="number"
                            name="order"
                            value={data.order}
                            onChange={handleChange('order')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                        />
                        {errors.order && (
                            <div className="text-red-600 text-sm">{errors.order}</div>
                        )}
                    </div>

                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            id="status"
                            name="status"
                            checked={data.status}
                            onChange={handleChange('status')}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="status" className="ml-2 block text-sm font-medium">
                            Abilitato
                        </label>
                    </div>
                </div>

                {/* Pulsante Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Salvataggio...' : 'Salva Categoria'}
                    </button>
                </div>
            </form>
        </>
    );
}
