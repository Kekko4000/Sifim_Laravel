import React, { useState, useRef } from 'react';

import { useForm } from '@inertiajs/react';
import { useMultiCategories } from '@/Hook/Post/Generic';
import { useAutoLoader } from '@/Hook/useAutoLoader'
import LoaderGlobal from '@/Components/LoaderGlobal'
import { validateForm } from '@/Utils/form';
import axios from 'axios';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
const libraries = ['places'];

const Form = (
    {
        languages = ['it', 'en'],
        onSubmitUrl = '/admin/apartments/create',
        existingData = null,
        params = 'add',
    }
) => {
    const loading = useAutoLoader('l-global');
    const [formData, setFormData] = useState({
        contract: existingData?.contract || '',
        typology: existingData?.typology
            ? JSON.parse(existingData.typology).id
            : '',
        price: existingData?.price || '',
        currency: existingData?.currency || 'EUR',
        address: existingData?.address || '',
        postal_code: existingData?.postal_code || '',
        city: existingData?.city || '',
        province: existingData?.province || '',
        latitude: existingData?.latitude || '',
        longitude: existingData?.longitude || '',
        rooms: existingData?.rooms || '',
        bedrooms: existingData?.bedrooms || '',
        bathrooms: existingData?.bathrooms || '',
        area_sqm: existingData?.area_sqm || '',
        floor: existingData?.floor || 0,
        total_floors: existingData?.total_floors || '',
        energy_class: existingData?.energy_class || '',
        heating_type: existingData?.heating_type || '',
        condo_fees: existingData?.condo_fees || '',
        parking_spaces: existingData?.parking_spaces || 0,
        has_garden: existingData?.has_garden || false,
        garden_area_sqm: existingData?.garden_area_sqm || '',
        image: existingData?.image ?? null,
        has_terrace: existingData?.has_terrace || false,
        terrace_area_sqm: existingData?.terrace_area_sqm || '',
        has_balcony: existingData?.has_balcony || false,
        has_elevator: existingData?.has_elevator || false,
        is_furnished: existingData?.is_furnished || false,
        has_pool: existingData?.has_pool || false,
        availability_date: existingData?.availability_date || '',
        status: existingData?.status ?? false,
    });



    // Hook per caricamento Google Places
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries,
    });
    const autoRef = useRef(null);

    // Gestore del place selezionato
    const handlePlaceChanged = () => {
        const place = autoRef.current.getPlace();
        if (!place.geometry) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        // Estrai address components
        let postal = '';
        let city = '';
        let province = '';
        place.address_components.forEach(component => {
        const types = component.types;
        if (types.includes('postal_code')) postal = component.long_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_2')) province = component.short_name;
        });
        setFormData(prev => ({
        ...prev,
        address: place.formatted_address,
        postal_code: postal,
        city,
        province,
        latitude: lat,
        longitude: lng,
        }));
    };

    

    // 2) Carica le select se usi hook personalizzati
    const [typology] = useMultiCategories(1);
    const [contract] = useMultiCategories(4);

    // 3) useForm per meta multilingua, inizializzato da existingData.meta
    const { data: metaData, setData: setMeta, errors } = useForm({
        meta: languages.reduce((acc, lang) => {
            acc[lang] = {
                language: lang,
                title: existingData?.meta?.[lang]?.title || '',
                description: existingData?.meta?.[lang]?.description || '',
                place: existingData?.meta?.[lang]?.place || '',
                other: existingData?.meta?.[lang]?.other || '',
                slug: existingData?.meta?.[lang]?.slug || '',
            };
            return acc;
        }, {}),
    });


     const [activeLang, setActiveLang] = useState(languages[0]);

    // 4) Gestori di campo
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : type === 'file'
                        ? files[0]
                        : value,
        }));
    };

    const generateSlug = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

    const handleMetaChange = (field) => (e) => {
        const v = e.target.value;
        setMeta('meta', {
            ...metaData.meta,
            [activeLang]: {
                ...metaData.meta[activeLang],
                [field]: v,
                ...(field === 'title' ? { slug: generateSlug(v) } : {}),
            },
        });
    };

    // 5) Invio del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm('#create-apartments')) return;

        const fd = new FormData();

        Object.entries(formData).forEach(([k, v]) => {
            if (v === null || v === undefined) return;

            if (k === 'image') {
            if (v instanceof File) fd.append('image', v); 
            } else {
            if (typeof v === 'boolean') fd.append(k, v ? '1' : '0');
            else fd.append(k, String(v));
            }
        });
        Object.entries(metaData.meta).forEach(([lang, fields]) => {
            Object.entries(fields).forEach(([field, value]) => {
            fd.append(`meta[${lang}][${field}]`, value ?? '');
            });
        });

    try {
        await axios.post(onSubmitUrl, fd, {
        withCredentials: true, // se usi cookie/XSRF
        });

        const url = new URL(window.location.href);
        url.searchParams.set(params, 'ok');
        window.location.href = url.toString();
    } catch (err) {
        if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
        } else {
        console.error('Errore inaspettato:', err);
        }
    }
    };

    return (
        <>
            {loading && <LoaderGlobal targetId="l-global" />}
            <form id='create-apartments' onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 bg-white shadow rounded space-y-6" encType="multipart/form-data">
                <h2 className="text-2xl font-semibold">
                    {existingData ? 'Modifica Immobile' : 'Aggiungi Immobile'}
                </h2>

                {/* Select Contratto e Tipologia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Contratto</label>
                        <select
                            name="contract"
                            value={formData.contract}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                            required
                        >
                            <option value="">Scegli...</option>
                            {contract.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Tipologia</label>
                        <select
                            name="typology"
                            value={formData.typology}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                            required
                        >
                            <option value="">Scegli...</option>
                            {typology &&
                            typology.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="border-t pt-4">
                    <h3 className="text-xl font-medium mb-4">Meta Multilingua</h3>

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
                        {['title', 'description', 'place', 'other'].map((field) => (
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
                                        value={metaData.meta[activeLang][field]}
                                        onChange={handleMetaChange(field)}
                                        rows={field === 'description' ? 3 : 2}
                                        className="mt-1 block w-full border rounded p-2"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={`meta[${activeLang}].${field}`}
                                        value={metaData.meta[activeLang][field]}
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

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    
                           <div>
                    <label className="block text-sm font-medium">Indirizzo</label>
                    {isLoaded ? (
                        <Autocomplete
                        onLoad={ref => (autoRef.current = ref)}
                        onPlaceChanged={handlePlaceChanged}
                        >
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                            placeholder="Inizia a digitare..."
                            required
                        />
                        </Autocomplete>
                    ) : (
                        <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2"
                        placeholder="Caricamento Google..."
                        disabled
                        />
                    )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">CAP</label>
                        <input type="text" name="postal_code" onChange={handleChange} value={formData.postal_code} className="mt-1 block w-full border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Città</label>
                        <input type="text" name="city" onChange={handleChange} value={formData.city} className="mt-1 block w-full border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Provincia</label>
                        <input type="text" name="province" maxLength={2} onChange={handleChange} value={formData.province} className="mt-1 block w-full border rounded p-2" required />
                    </div>
                </div>

                

                {/* Coordinate */}
                <div>
                    <input
                        type="hidden"
                        step="0.0000001"
                        name="latitude"
                        onChange={handleChange}
                        value={formData.latitude}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <input
                        type="hidden"
                        step="0.0000001"
                        name="longitude"
                        onChange={handleChange}
                        value={formData.longitude}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>

                <div>
                        <label className="block text-sm font-medium">Prezzo</label>
                        <input type="number" step="0.01" name="price" onChange={handleChange} value={formData.price} className="mt-1 block w-full border rounded p-2" required />
                    </div>

                {/* Camere e dimensioni */}
                <div>
                    <label className="block text-sm font-medium">Locali</label>
                    <input
                        type="number"
                        name="rooms"
                        onChange={handleChange}
                        value={formData.rooms}
                        className="mt-1 block w-full border rounded p-2"
                        required
                    />
                </div>

                {/* Camere e dimensioni */}
                <div>
                    <label className="block text-sm font-medium">Camere da letto</label>
                    <input
                        type="number"
                        name="bedrooms"
                        onChange={handleChange}
                        value={formData.bedrooms}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Bagni</label>
                    <input
                        type="number"
                        name="bathrooms"
                        onChange={handleChange}
                        value={formData.bathrooms}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Superficie (mq)</label>
                    <input
                        type="number"
                        name="area_sqm"
                        onChange={handleChange}
                        value={formData.area_sqm}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>

                {/* Piani */}
                <div>
                    <label className="block text-sm font-medium">Piano</label>
                    <input
                        type="number"
                        name="floor"
                        onChange={handleChange}
                        value={formData.floor}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Totale piani</label>
                    <input
                        type="number"
                        name="total_floors"
                        onChange={handleChange}
                        value={formData.total_floors}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>

                {/* Servizi e spese */}
                <div>
                    <label className="block text-sm font-medium">Classe energetica</label>
                    <input
                        type="text"
                        name="energy_class"
                        onChange={handleChange}
                        value={formData.energy_class}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tipo di riscaldamento</label>
                    <input
                        type="text"
                        name="heating_type"
                        onChange={handleChange}
                        value={formData.heating_type}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Spese condominiali (€/mese)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="condo_fees"
                        onChange={handleChange}
                        value={formData.condo_fees}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>

                {/* Posti auto */}
                <div>
                    <label className="block text-sm font-medium">Posti auto</label>
                    <input
                        type="number"
                        name="parking_spaces"
                        onChange={handleChange}
                        value={formData.parking_spaces}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>

                {/* Altri servizi */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="has_garden"
                        checked={formData.has_garden}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Giardino</label>
                </div>
                {formData.has_garden && (
                    <div>
                        <label className="block text-sm font-medium">Superficie giardino (mq)</label>
                        <input
                            type="number"
                            name="garden_area_sqm"
                            onChange={handleChange}
                            value={formData.garden_area_sqm}
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="has_terrace"
                        checked={formData.has_terrace}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Terrazza</label>
                </div>
                {formData.has_terrace && (
                    <div>
                        <label className="block text-sm font-medium">Superficie terrazza (mq)</label>
                        <input
                            type="number"
                            name="terrace_area_sqm"
                            onChange={handleChange}
                            value={formData.terrace_area_sqm}
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="has_balcony"
                        checked={formData.has_balcony}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Balcone</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="has_elevator"
                        checked={formData.has_elevator}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Ascensore</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_furnished"
                        checked={formData.is_furnished}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Arredato</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="has_pool"
                        checked={formData.has_pool}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Piscina</label>
                </div>

                <div>
                    <label className="block text-sm font-medium">Immagine Copertina</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="mt-1 block w-full text-sm text-gray-500 cursor-pointer"
                        />
                    {errors.image && (
                        <div className="text-red-600 text-sm">{errors.image}</div>
                    )}

                    {existingData?.image &&
                        <div><a  href={`${window.location.origin}/storage/${existingData.image}`}
                                        target='_blank'>[Visualizza]</a></div>
                    }

                </div>

                {/* Disponibilità e stato */}
                <div>
                    <label className="block text-sm font-medium">Disponibilità (data)</label>
                    <input
                        type="date"
                        name="availability_date"
                        onChange={handleChange}
                        value={formData.availability_date}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label className="text-sm">Abilitato</label>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">Salva</button>
                </div>
            </form>
        </>
    );
};

export default Form;
