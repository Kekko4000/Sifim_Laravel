import { usePage } from '@inertiajs/react';
import Form from '@/Pages/Admin/contents/Form';

export default function Edit() {
  const { props } = usePage();
  const contents = props.contents;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Modifica Contenuto</h1>
      <Form
        existingData={contents}
        onSubmitUrl={`/admin/contents/${contents.id}`}
      />
    </div>
  );
}
