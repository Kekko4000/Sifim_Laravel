// resources/js/Pages/Auth/Register.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/admin/login');
  }

  return (
    <div className='w-full flex justify-center '>
      <div className="max-w-md mx-auto mt-12 p-4 rounded-lg shadow-xl w-[300px]">
        <h1 className="text-2xl font-bold mb-6">Registrati</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
