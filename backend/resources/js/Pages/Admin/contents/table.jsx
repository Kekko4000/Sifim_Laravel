import React, { useState, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Table({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1) Costruisce ricorsivamente l'albero
  function buildTree(items, parentId = 0) {
    return items
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  }

  // 2) Appiattisce l'albero aggiungendo `depth`
  function flattenTree(tree, depth = 0) {
    return tree.reduce((acc, item) => {
      acc.push({ ...item, depth });
      if (item.children?.length) {
        acc.push(...flattenTree(item.children, depth + 1));
      }
      return acc;
    }, []);
  }

  // 3) Ottieni flatData e calcola paginazione
  const tree       = buildTree(data);
  const flatData   = flattenTree(tree);

  const totalPages = Math.ceil(flatData.length / itemsPerPage);
  const start      = (currentPage - 1) * itemsPerPage;
  const paginated  = flatData.slice(start, start + itemsPerPage);
  const indentClasses = ['pl-0','pl-8','pl-16','pl-32','pl-64'];

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

  return (
    <div className="w-full mx-auto mt-6 flex flex-col h-[600px] justify-between">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome (IT)</th>
            <th className="p-2 text-left">Ordine</th>
            <th className="p-2 text-left">Stato</th>
            <th className="p-2 text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.id}</td>
              <td className={`p-2 ${indentClasses[item.depth] || indentClasses.at(-1)}`}>
                {item.nome || '-'}
              </td>
              <td className="p-2">{item.order}</td>
              <td className="p-2">
                {item.status ? 'Abilitato' : 'Disabilitato'}
              </td>
              <td className="p-2 text-center space-x-2">
                <Link href={`/admin/contents/${item.id}/edit`}>
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

      {/* 4) Paginazione numerica */}
      <div className="flex justify-end items-center mt-4 gap-2 flex-wrap">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            const showDots = prev && page - prev > 1;
            return (
              <Fragment key={page}>
                {showDots && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              </Fragment>
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
