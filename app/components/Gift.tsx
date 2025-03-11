import GiftIcon from '../icons/GiftIcon';
import BorderedDiv from './BorderedDiv';
import Button from './Button';
import SectionTitle from './SectionTitle';

const Gift = () => {
    return (
        <BorderedDiv>
            <SectionTitle title="Your Love Is Our Greatest Gift" />
            <p className="text-md">
                Having you celebrate with us is the greatest gift.
                <br />
                However, if you&#39;d like to send a token of your love, please click the button below.
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
        </BorderedDiv>
    );
};

export default Gift;
