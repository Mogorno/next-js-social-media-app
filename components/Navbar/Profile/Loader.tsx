import { IoPerson } from 'react-icons/io5';

const Loader = () => {
    return (
        <div
            className="relative w-10 aspect-square animate-pulse overflow-hidden rounded-full"
            role="status"
        >
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-solid border-mainText border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <div className="absolute inset-2 bg-secondaryText rounded-full flex justify-center items-center animate-ping">
                <IoPerson className="text-innerText" />
            </div>
        </div>
    );
};

export default Loader;
