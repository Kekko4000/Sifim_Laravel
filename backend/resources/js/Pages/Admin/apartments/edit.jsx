import { usePage } from '@inertiajs/react';
import Form from '@/Pages/Admin/apartments/Form';

export default function Edit() {
  const { props } = usePage();
  const appart = props.apartments;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Modifica Immobile</h1>

      <Form
        existingData={appart}
        onSubmitUrl={`/admin/apartments/update/${appart.id}`}
        params = 'edit'
      />
    </div>
  );
}
