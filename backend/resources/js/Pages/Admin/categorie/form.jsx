import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useMultiCategories } from '@/Hook/Post/Generic';
import { flattenCategoriesWithDepth } from '@/Utils/form'
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Form({
    languages = ['it', 'en'],
    onSubmitUrl = '/admin/categorie/create',
    existingData = null,
}) {
    
    const { data, setData, post, put, processing, errors } = useForm({
    parent_id: existingData?.parent_id || '',
    image: existingData?.image ?? 0,
    order: existingData?.order ?? 0,
    enabled: existingData?.enabled ?? true,
    meta: languages.reduce((acc, lang) => {
        acc[lang] = {
        language: lang,
        name: existingData?.meta?.[lang]?.name || '',
        description: existingData?.meta?.[lang]?.description || '',
        slug: existingData?.meta?.[lang]?.slug || '',
        link: existingData?.meta?.[lang]?.link || '',
        };
        return acc;
    }, {}),
    });

    const [categories] = useMultiCategories(0);
    const flatCats = flattenCategoriesWithDepth(categories)
    const [activeLang, setActiveLang] = useState(languages[0]);

    // Funzione helper per generare slug
    const generateSlug = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

    // Gestione campi generali
    const handleChange = (field) => (e) => {
        const value =
            field === 'image'
                ? e.target.files[0]
                : e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value;
        setData(field, value);
    };

    // Gestione campi traduzioni e slug automatico
    const handleMetaChange = (lang, field) => (e) => {
        const newValue = e.target.value;
        setData('meta', {
            ...data.meta,
            [lang]: {
                ...data.meta[lang],
                [field]: newValue,
                ...(field === 'name' ? { slug: generateSlug(newValue) } : {}),
                language: lang,
            },
        });
    };

    function submit(e) {
        e.preventDefault();
        post(onSubmitUrl, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: (page) => {
            const url = new URL(window.location.href);
            url.searchParams.set(params, 'ok');
            window.location.href = url.toString();
        },
        });
    }

    return (
        <form
            onSubmit={submit}
            encType="multipart/form-data"
            className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
            {/* Sezione Traduzioni */}
            <div>
                <div className='w-full flex justify-between'>
                    <h2 className="text-lg font-semibold mb-3">Traduzioni</h2>
                    <Link className='btn-default' href='/admin/categorie/cerca'>
                        <ArrowLeftIcon className="w-5 h-5 mr-2 inline" />
                        Torna Indietro
                    </Link>
                </div>
                {/* Tab Lingue */}
                <div className="flex space-x-2 mb-4">
                    {languages.map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveLang(lang)}
                            className={`px-3 py-1 rounded ${activeLang === lang
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Campi attivi per la lingua selezionata */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name ({activeLang})</label>
                        <input
                            type="text"
                            name={`meta[${activeLang}].name`}
                            value={data.meta[activeLang].name}
                            onChange={handleMetaChange(activeLang, 'name')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                        />
                        {errors[`meta.${activeLang}.name`] && (
                            <div className="text-red-600 text-sm">
                                {errors[`meta.${activeLang}.name`]}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description ({activeLang})</label>
                        <textarea
                            name={`meta[${activeLang}].description`}
                            value={data.meta[activeLang].description}
                            onChange={handleMetaChange(activeLang, 'description')}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                        />
                        {errors[`meta.${activeLang}.description`] && (
                            <div className="text-red-600 text-sm">
                                {errors[`meta.${activeLang}.description`]}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Link ({activeLang})</label>
                        <input
                            type="text"
                            name={`meta[${activeLang}].link`}
                            value={data.meta[activeLang].link}
                            onChange={handleMetaChange(activeLang, 'link')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                        />
                        {errors[`meta.${activeLang}.link`] && (
                            <div className="text-red-600 text-sm">
                                {errors[`meta.${activeLang}.link`]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sezione Generale */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium">Parent Category</label>
                    <select
                        name="parent_id"
                        value={data.parent_id}
                        onChange={e => setData('parent_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring"
                    >
                        <option value="0">-- Nessuno --</option>
                        {flatCats.map(cat => (
                            <option
                                key={cat.id}
                                value={cat.id}
                            >
                                {/* inserisco tanti spazi " " quanta è la profondità */}
                                {Array(cat.depth).fill('  ').join('')}{cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.parent_id && (
                        <div className="text-red-600 text-sm">{errors.parent_id}</div>
                    )}
                </div>

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
                        id="enabled"
                        name="enabled"
                        checked={data.enabled}
                        onChange={handleChange('enabled')}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm font-medium">
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
    );
}
