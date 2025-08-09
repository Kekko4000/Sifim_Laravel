import { Link } from '@inertiajs/react';
import CategorieTable from './table';
import { usePage } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function Cerca() {
  const { props } = usePage(); // supponendo che ricevi i dati da Laravel
  const apartments = props.apartments || [];
  return (
    <div className="p-6">
      <div className='w-full flex justify-between'>
        <h1 className="text-xl font-bold mb-4">Immobili</h1>
        <Link className='btn-default' href='/admin/apartments/create'>
          <PlusIcon className="inline w-5 h-5 mr-1" />
          Inserisci
        </Link>
      </div>
      <CategorieTable data={apartments} />
    </div>
  );
}
