import { usePage } from '@inertiajs/react';
import Form from '@/Pages/Admin/texts/form';

export default function Edit() {
  const { props } = usePage();
  const texts = props.texts;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Modifica Testi</h1>
      <Form
        existingData={texts}
        onSubmitUrl={`/admin/texts/update/${texts.id}`}
        params={'edit'}
      />
    </div>
  );
}
