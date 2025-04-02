import GiftIcon from '../../icons/GiftIcon';
import BorderedDiv from '../BorderedDiv';
import Button from '../Button';
import Modal from '../Modal';
import SectionTitle from '../SectionTitle';
import Image from 'next/image';
import './gift.css';
import { useState } from 'react';

const Gift = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <BorderedDiv>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div className="flex flex-col w-full h-full items-center justify-center gap-8 -translate-y-20 p-4">
                    Please send your gift to the following account numbers:
                    <div className="flex rounded-lg border-secondary-main border-2 p-4 items-center gap-4 background-pattern self-stretch justify-start">
                        <div id="logo" className="w-14 h-14 relative">
                            <Image src="/images/ocbc.png" alt={'OCBC logo'} fill className="block h-auto w-full" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">OCBC</p>
                            Karel Karunia
                            <br />
                            505810127041
                        </div>
                    </div>
                    <div className="flex rounded-lg border-secondary-main border-2 p-4 items-center gap-4 background-pattern self-stretch justify-start">
                        <div id="logo" className="w-16 h-16 relative">
                            <Image src="/images/paypal.png" alt={'Paypal logo'} fill className="block w-full" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">Paypal</p>
                            <p>karelkarunia24@gmail.com</p>
                            <a
                                href="https://paypal.me/karelkarunia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Link to my paypal
                            </a>
                            <p className="text-xs">*please choose friends and family</p>
                        </div>
                    </div>
                </div>
            </Modal>

            <SectionTitle title="Your Love Is Our Greatest Gift" />
            <p className="text-md">
                Having you celebrate with us is the greatest gift.
                <br />
                However, if you&#39;d like to send a token of your love, please click the button below.
                <br />
                Thank you for your kindness! 💕
            </p>
            <div>
                <Button alternateBackground onClick={() => setOpen(true)}>
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
