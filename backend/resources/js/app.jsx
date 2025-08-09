// resources/js/app.jsx
import './bootstrap';
import '../css/app.css'; 
import 'flowbite';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot }        from 'react-dom/client';

// **1. Importa i18n e il provider**
import { I18nextProvider }   from 'react-i18next';
import i18n                  from './i18n';

import WebsiteLayout from './Layouts/Layout';
import AdminLayout   from './Layouts/AdminLayout';


// Eagerly import all pages sotto Pages/
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

createInertiaApp({
  resolve: name => {
    const importKey = `./Pages/${name}.jsx`;
    const page      = pages[importKey];
    if (!page) throw new Error(`Page not found: ${importKey}`);

    const isAdmin = name.startsWith('Admin/');
    page.default.layout = page.default.layout || (page =>
      isAdmin
        ? <AdminLayout>{page}</AdminLayout>
        : <WebsiteLayout>{page}</WebsiteLayout>
    );

    return page;
  },

  // **2. Nel setup sincronizziamo la lingua e avvolgiamo l’app**
  setup({ el, App, props }) {
    // Laravel/Inertia deve aver condiviso la proprietà `locale`
    // (es. via Inertia::share('locale', fn() => app()->getLocale()))
    const serverLocale =
      // nei più recenti Inertia il locale è in props.initialPage.props
      props.initialPage?.props.locale
      // fallback su props.page.props.locale
      || props.page?.props.locale;

    if (serverLocale && i18n.language !== serverLocale) {
      i18n.changeLanguage(serverLocale);
    }

    createRoot(el).render(
      <I18nextProvider i18n={i18n}>
        <App {...props} />
      </I18nextProvider>
    );
  },

  progress: {
    color: '#29d',
    showSpinner: false,
  },
});
