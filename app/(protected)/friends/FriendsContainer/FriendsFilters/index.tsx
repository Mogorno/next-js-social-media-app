import ConditionIcon from '@/components/ui/ConditionIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

const FriendsFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const current = new URLSearchParams(searchParams);
    const sort = current.get('sort');

    const toggleSort = () => {
        const newSort = sort === 'asc' ? 'desc' : 'asc';
        current.set('sort', newSort);
        router.push(`?${current.toString()}`);
    };
    return (
        <div>
            <button onClick={toggleSort}>
                <ConditionIcon
                    renderIndex={sort === 'asc' ? 1 : 0}
                    Icons={[FaSortAlphaDown, FaSortAlphaUp]}
                />
            </button>
        </div>
    );
};

export default FriendsFilters;
