import Form from '@/Pages/Admin/categorie/form';

export default function Inserimento() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Aggiungi Categoria</h1>
      <Form
        onSubmitUrl={`/admin/categorie/create`}
        params = {'add'}
      />
    </div>
  );
}
