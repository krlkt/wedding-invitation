import LocationCard from './LocationCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pick location: Karel & Sabrina's Wedding Invitation",
    description: 'Pick a location of the wedding you are going to visit',
};

export default function LandingPage() {
    return (
        <div className="min-h-screen text-center py-8 px-4">
            <div id="container" className="flex flex-col gap-8">
                <header>
                    <h2 className="font-serif font-bold text-4xl">
                        Hi Guest 👋
                    </h2>
                    <h3 className="text-xl font-serif">
                        Which wedding are you going to attend?
                    </h3>
                </header>
                <div
                    id="card-container"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-left"
                >
                    <LocationCard
                        imageSrc={'/images/malang_restaurant.jpg'}
                        locationName={'Malang - chinese restaurant'}
                        href={'malang'}
                    />
                    <LocationCard
                        imageSrc={'/images/angke.jpg'}
                        locationName={'Jakarta - Angke Kelapa Gading'}
                        href={'jakarta'}
                    />
                    <LocationCard
                        imageSrc={'/images/tirtha_uluwatu.jpg'}
                        locationName={'Bali - Tirtha Uluwatu'}
                        href={'bali'}
                    />
                </div>
            </div>
        </div>
    );
}
