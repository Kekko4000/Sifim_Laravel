import React from 'react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation(['testi','componenti']);

  return (
    <div>
      {/* namespace 'testi' (default) */}
      <h1>{t('2')}</h1>

      {/* namespace 'componenti' */}
      <h2>{t('componenti:1.subtitle')}</h2>
      <p>{t('componenti:1.description')}</p>
      <a href="/about">{t('componenti:1.link')}</a>
    </div>
  );
}
