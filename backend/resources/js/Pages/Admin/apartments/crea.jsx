import Form from '@/Pages/Admin/apartments/form';

export default function Crea() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Aggiungi Immobile</h1>
      <Form
        onSubmitUrl={`/admin/apartments/create`}
      />
    </div>
  );
}
