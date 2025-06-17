import { memo } from 'react';
import FilteredUserList from './FilteredUserList';

// const Settings = async () => {
//     const session = await auth();
//     return <div>{JSON.stringify(session)}</div>;
// };

// export default Settings;
const users = [
    { name: 'test', id: 1 },
    { name: 'test2', id: 2 },
    { name: 'test3', id: 3 },
];

const Settings = () => {
    return (
        <div>
            <FilteredUserList users={users} />
        </div>
    );
};

export default memo(Settings);
