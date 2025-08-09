import Navbar from '@/Components/Navbar/Navbar';
import '../../css/global.css';

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    );
}