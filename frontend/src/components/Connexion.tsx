import React from 'react';
import Header from './Header';
import arrow from '../assets/fleche-droite.png';
import photoProfil from '../assets/photo_profil.png';
import photoPorfil2 from '../assets/photo_profil2.png';
import photoProfil3 from '../assets/photo_profil3.png';
import photoProfil4 from '../assets/photo_profil4.png';

const Connexion: React.FC = () => {
    return (
        <div className="h-screen bg-customdark flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center gap-4">

                <div className='bg-blue-200 w-1/3 h-2/3 rounded-lg p-6 ml-4 flex items-center justify-between'>
                    <img src={arrow} alt="Logo" className="w-1/6 h-24 scale-x-[-1]" />
                    <img src={photoProfil} alt="Logo" className="w-4/6 h-4/6 m-0" />
                    <img src={arrow} alt="Logo" className="w-1/6 h-24 m-0" />
                </div>

                <div className="bg-blue-200 w-1/3 h-2/3 rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-center">Connexion</h2>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300"
                    />
                    <button className="w-full h-12 bg-green-600 text-white rounded-lg">
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Connexion;