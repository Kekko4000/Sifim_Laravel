import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function Table({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = data.slice(start, start + itemsPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  console.log(data);


  return (
    <div className="w-full mx-auto mt-6 h-[600px] flex flex-col justify-between">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome (IT)</th>
            <th className="p-2 text-left">Prezzo</th>
            <th className="p-2 text-left">Stato</th>
            <th className="p-2 text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 ">{item.id}</td>
              <td className="p-2">{item.meta?.it?.title || '-'}</td>
              <td className="p-2">{(item.price).replace('.',',')}€</td>
              <td className="p-2">{item.enabled ? 'Abilitato' : 'Disabilitato'}</td>
              <td className="p-2 text-center space-x-2">
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href={`/admin/apartments/edit/${item.id}`}
                >
                  <PencilIcon className="w-5 h-5 inline" />
                </Link>
                <button
                  title="Elimina"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => console.log('Elimina', item.id)}
                >
                  <TrashIcon className="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginazione */}
      <div className="flex justify-end items-center mt-4 gap-2 flex-wrap">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            // Mostra solo le pagine vicine, la prima e l’ultima
            return (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            );
          })
          .map((page, i, array) => {
            // Inserisce i puntini "..." se c’è un buco tra i numeri
            const prevPage = array[i - 1];
            const showDots = prevPage && page - prevPage > 1;

            return (
              <React.Fragment key={page}>
                {showDots && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
