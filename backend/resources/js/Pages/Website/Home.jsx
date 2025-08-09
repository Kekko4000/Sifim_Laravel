import { usePage } from '@inertiajs/react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import bgHomeSearch from '../../../img/bgHomeSearch.jpg'
import Img from '../../../img/Img.jpg'
import '../../../css/Pages/Home.css';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Blog from '@/Components/Blog/Blog.jsx'

export default function Home(tipology) {
  const { props: { locale } } = usePage();

  //per le tipologie da usare in caso nel futuro
  const typologys = JSON.stringify(tipology, null, 2);
  return (
    <div>
      <HomeSearch />
      <Blog
        className='right'
        title='Salva le tue Ricerche'
        subtitle=''
        description='Non farti scappare la casa dei tuoi sogni: registrati ora e metti al sicuro i tuoi annunci preferiti!'
        img={Img}
        btn = 'Registrati'
        link = 'accedi'
      />
    </div>
  );
}


function HomeSearch() {
  return (
    <section
      id="homeSearch"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgHomeSearch})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
      <div className="container text-center text-white h-full">
        <div className='l-search'>
          <h1 className="text-4xl font-bold mb-2 main-title ">Trova la tua casa ideale</h1>
          <h3 className="text-xl mb-6">Esplora gli immobili esclusivi nella tua zona</h3>
          <form className="flex gap-2">
            <div className='p-input'>
                <div className='l-input'>
                <MapPinIcon className='icon' />
                <input
                  type="text"
                  name="place"
                  placeholder="Città, zona, quartiere…"
                  className="flex-1 border border-gray-300 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary search px-4"
              >
                Cerca
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}



// Come avere un layout specifico su un componente
// import Layout from "../Layouts/Layout";
// function Home() {
//     return <>
//         <h1> Funziona</h1>
//     </>;
// }
// Home.layout = page => <Layout children={page} />
// export default Home; 
