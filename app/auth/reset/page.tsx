import Reset from '@/components/Auth/Reset';

const ResetPage = () => {
    return (
        <div className="layout flex items-center justify-center min-h-[calc(100vh-6rem-1.5rem)]">
            <section className="w-80 flex flex-col gap-6 items-center justify-center">
                <header className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-2xl font-bold text-mainText ">Reset</h1>
                    <h5 className="text-sm text-secondaryText">
                        Forgot your password?
                    </h5>
                    <span className="text-sm text-secondaryText">
                        Enter your email to get a reset link.
                    </span>
                </header>
                <Reset />
            </section>
        </div>
    );
};

export default ResetPage;
