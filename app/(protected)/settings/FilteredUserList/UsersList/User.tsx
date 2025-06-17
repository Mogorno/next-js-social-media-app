export type UserProps = {
    user: { name: string; id: number };
};

const User = ({ user }: UserProps) => {
    return (
        <li className="bg-black text-white p-1 rounded">
            User name: {user.name}
        </li>
    );
};

export default User;
