import { auth } from '@/auth';
import ImageUploadForm from '@/components/Forms/ImageUploadForm';
import UpdateUserFieldForm from '@/components/Forms/UpdateUserFieldForm';
import { getUserById } from '@/data/user/getUser';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user.id) return null;

    const user = await getUserById(session.user.id);
    if (!user) return null;

    const editingUserFields = ['name', 'email'] as const;

    const fieldSettings: Record<
        'name' | 'email',
        { type: 'text' | 'email'; placeholder: string }
    > = {
        name: { type: 'text', placeholder: 'Name' },
        email: { type: 'email', placeholder: 'E-mail' },
    };
    return (
        <div className="layout flex flex-col items-center gap-8 m-4">
            <h1 className="text-2xl font-bold text-mainText">Edit Profile</h1>
            <ImageUploadForm />
            {editingUserFields.map((field) => (
                <UpdateUserFieldForm
                    key={field}
                    userId={user.id}
                    field={field}
                    currentValue={user[field] ?? ''}
                    placeholder={fieldSettings[field].placeholder}
                    type={fieldSettings[field].type}
                />
            ))}
        </div>
    );
}
