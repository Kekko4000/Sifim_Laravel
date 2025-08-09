import Form from '@/Pages/Admin/texts/form';

export default function Create() {
  return (
    <div className="  ">
      <h1 className="text-xl font-bold mb-4">Aggiungi Testo</h1>
      <Form
        onSubmitUrl={`/admin/texts/create`}
        params = {'add'}
      />
    </div>
  );
}
