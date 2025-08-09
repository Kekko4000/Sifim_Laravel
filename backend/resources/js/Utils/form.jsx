/**
 * Riceve un array di categorie con proprietà `children`
 * e restituisce un array piatto di oggetti { id, name, depth }.
 */
export function flattenCategoriesWithDepth(categories, depth = 0) {
  return categories.reduce((acc, cat) => {
    // prendo il nome italiano
    const name = cat.meta?.it?.name || cat.nome || `ID ${cat.id}`
    // aggiungo la voce corrente
    acc.push({ id: cat.id, name, depth })

    // se ha figli, li processo ricorsivamente con depth+1
    if (Array.isArray(cat.children) && cat.children.length) {
      acc.push(...flattenCategoriesWithDepth(cat.children, depth + 1))
    }
    return acc
  }, [])
}


//CONTROLLO VALIDAZIONE FORM
export function validateForm(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) {
    console.warn(`Form not found: ${formSelector}`);
    return false;
  }

  let isValid = true;
  // query all required inputs, textareas, selects
  const requiredFields = form.querySelectorAll(
    'input[required], textarea[required], select[required]'
  );

  requiredFields.forEach(field => {
    // Reset previous error state
    field.classList.remove('error');

    let value;
    if (field.type === 'checkbox' || field.type === 'radio') {
      value = field.checked;
    } else {
      value = field.value != null ? field.value.trim() : '';
    }

    // If empty or unchecked, mark error
    if (!value) {
      console.log(field);
      field.classList.add('error');
      isValid = false;
    }
  });

  return isValid;
}
