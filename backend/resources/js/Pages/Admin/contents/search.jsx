import { Link } from '@inertiajs/react';
import Table from './table';
import { usePage } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function Search() {
  const { props } = usePage(); // supponendo che ricevi i dati da Laravel
  const contents = props.contents || [];


  return (
    <div className="p-6">
      <div className='w-full flex justify-between'>
        <h1 className="text-xl font-bold mb-4">Contenuti</h1>
        <Link className='btn-default' href='/admin/contents/create'>
          <PlusIcon className="inline w-5 h-5 mr-1" />
          Inserisci
        </Link>
      </div>
      <Table data={contents} url = {'admin/contents'} />
    </div>
  );
}
