import GiftIcon from '../icons/GiftIcon';
import Button from './Button';

const Gift = () => {
    return (
        <div className="p-6 py-16 border rounded-lg shadow-lg bg-white flex flex-col gap-4 border-blue-700">
            <h2 className="text-4xl font-cursive_nautigal text-gray-700 text-center">
                Your Love Is Our Greatest Gift
            </h2>
            <p className="text-md">
                Having you celebrate with us is the greatest gift.
                <br />
                However, if you&#39;d like to send a token of your love, please
                click the button below.
                <br />
                Thank you for your kindness! 💕
            </p>
            <div>
                <Button alternateBackground>
                    <span className="flex gap-2 justify-center items-center">
                        Send gift
                        <div className="w-4 h-4">
                            <GiftIcon />
                        </div>
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Gift;
