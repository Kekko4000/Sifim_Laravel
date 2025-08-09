import Form from '@/Pages/Admin/contents/form';

export default function Create() {
  return (
    <div className="  ">
      {/* <h1 className="text-xl font-bold mb-4"></h1> */}
      <Form
        onSubmitUrl={`/admin/contents`}
        params = {'add'}
        title = {"Aggiungi Testo"}
      />
    </div>
  );
}
