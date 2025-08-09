import { useState, useEffect } from 'react';
import axios from 'axios';


//DATO UN PARENTID PRENDERE TUTTE LE CATEGORIE
export function useMultiCategories(id = 0, post = 'categories') {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let isMounted = true;
    axios
      .get(`/${post}/parentID/${id}`)
      .then(res => {
        if (isMounted) {
          setCategories(res.data);
        }
      })
      .catch(err => {
        console.error('Errore caricamento categorie:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);
  return [categories, setCategories];
}