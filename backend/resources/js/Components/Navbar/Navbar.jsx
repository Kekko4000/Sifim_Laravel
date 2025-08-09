import React, { useState, Fragment } from 'react';
import { Link, usePage } from "@inertiajs/react";
import { Dialog, Transition } from '@headlessui/react';
import { useMultiCategories } from '@/Hook/Post/Generic';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../../../img/Logo.png'
import LogoMobile from '../../../img/Logo_mobile.png'
import { useTranslation } from 'react-i18next';

// importa le variabili e gli stili base
import '../../../css/constants.css';
import '../../../css/Components/Navbar.css';

const allLinks = {
  it: [
    { id: 3, name: 'Chi siamo', slug: 'chi-siamo' },
    { id: 4, name: 'Contattaci', slug: 'contattaci' },
  ],
  en: [
    { id: 3, name: 'About us', slug: 'about' },
    { id: 4, name: 'Contact us', slug: 'contact-us' },
  ],
};


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { props: { locale } } = usePage();

  const links = allLinks[locale] || allLinks.it;
  const { t } = useTranslation(['testi', 'componenti']);
  const prefix = locale === 'it' ? '' : `/${locale}`;

  return (
    <>
      <header className="navbar">
        <div className="container">
          <Link href={prefix} className="logo">
            <img src={Logo} alt="Logo" />
          </Link>

          <nav className="nav-links hidden md:flex">
            {links.map(item => (
              <Link
                key={item.id}
                href={`${prefix}/${item.slug}`}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}

            {/* bottone CTA */}
            <Link
              href={`${prefix}/${t('testi:4').replace(/\s+/g, '-').toLowerCase()}`}
              className="btn btn-primary nav-cta"
            >
              {t('testi:4')}
            </Link>
          </nav>

          <button
            className={`hamburger md:hidden ${open ? 'active' : ''}`}
            aria-label="Apri menu"
            onClick={() => setOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Slide-Over Drawer */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          {/* overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-navbar" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
                    <div className="flex h-full flex-col overflow-y-auto">
                      <div className="flex items-center justify-between p-4">
                        <Dialog.Title className="text-2xl font-medium text-gray-900">
                          <Link href={prefix} className="logoMobile"><img src={LogoMobile} alt="Logo" /></Link>
                        </Dialog.Title>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setOpen(false)}
                        >
                          <XMarkIcon className="h-7 w-7 cursor-pointer" />
                        </button>
                      </div>

                      <nav className="p-4 flex flex-col gap-4">
                        {links.map(item => (
                          <Link
                            key={item.id}
                            href={`${prefix}/${item.slug}`}
                            className="mobile-link text-lg"
                            onClick={() => setOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}

                        <div className='mt-5'>
                          <Link
                          href={`${prefix}/${t('testi:4').replace(/\s+/g, '-').toLowerCase()}`}
                          className="btn btn-primary inline "
                        >
                          {t('testi:4')}
                        </Link>
                        </div>

                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
