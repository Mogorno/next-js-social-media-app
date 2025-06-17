import Register from '@/components/Auth/Register';

const SignUp = () => {
    return (
        <div className="layout flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-6rem-1.5rem)]">
            <h1 className="text-2xl font-bold text-mainText ">Sign up</h1>
            <Register />
        </div>
    );
};

export default SignUp;
