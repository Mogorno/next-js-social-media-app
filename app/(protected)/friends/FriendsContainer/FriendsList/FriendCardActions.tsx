'use client';

const FriendCardActions = ({ deleteFriend }: { deleteFriend: () => void }) => {
    return (
        <div className="absolute top-0 right-0 flex flex-col gap-2 p-2 rounded bg-secondaryBG text-mainText z-10">
            <button>Send Message</button>

            <button onClick={deleteFriend} value={'delete-user'}>
                Delete
            </button>
        </div>
    );
};

export default FriendCardActions;
