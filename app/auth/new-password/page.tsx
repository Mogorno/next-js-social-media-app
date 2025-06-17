import NewPassword from '@/components/Auth/NewPassword';

const NewPasswordPage = () => {
    return (
        <div className="layout flex items-center justify-center min-h-[calc(100vh-6rem-1.5rem)]">
            <section className="w-80 flex flex-col gap-6 items-center justify-center">
                <h1 className="text-2xl font-bold text-mainText ">
                    New Password
                </h1>
                <NewPassword />
            </section>
        </div>
    );
};

export default NewPasswordPage;
