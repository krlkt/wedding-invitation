import WishIcon from '@/app/icons/WishIcon';

const Divider = () => (
    <div className="flex gap-4 items-center">
        <div className="w-full h-[0.5px] bg-primary-main my-2" />
        <div className="w-20 h-20 flex items-center">
            <WishIcon />
        </div>
        <div className="w-full h-[0.5px] bg-primary-main my-2" />
    </div>
);

export default Divider;
