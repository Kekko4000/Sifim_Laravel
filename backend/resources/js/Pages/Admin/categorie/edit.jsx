import { usePage } from '@inertiajs/react';
import Form from '@/Pages/Admin/categorie/Form';

export default function Edit() {
  const { props } = usePage();
  const categorie = props.categorie;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Modifica Categoria</h1>

      <Form
        existingData={categorie}
        onSubmitUrl={`/admin/categorie/update/${categorie.id}`}
        params = 'edit'
      />
    </div>
  );
}
