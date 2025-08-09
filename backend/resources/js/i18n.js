import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// importa i file “grezzi”
import rawTesti      from './locales/testi.json';
import rawComponenti from './locales/componenti.json';

const locales   = ['it','en'];
const namespaces = ['testi','componenti'];

// costruisci lo shape atteso da i18next: resources[locale][ns] = { key: value, ... }
const resources = locales.reduce((acc, lng) => {
  acc[lng] = {};
  return acc;
}, {});

// popola testi
resources.it.testi = {};
resources.en.testi = {};
Object.entries(rawTesti).forEach(([key, obj]) => {
  locales.forEach(lng => {
    resources[lng].testi[key] = obj[lng];
  });
});

// popola componenti
resources.it.componenti = {};
resources.en.componenti = {};
Object.entries(rawComponenti).forEach(([key, obj]) => {
  locales.forEach(lng => {
    resources[lng].componenti[key] = obj[lng];
  });
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: namespaces,
    defaultNS: 'testi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
