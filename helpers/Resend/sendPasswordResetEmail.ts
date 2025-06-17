// import { EmailTemplate } from '@/components/EmailTemplate';
import { BASE_URL } from '@/routes';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationUrl = `${BASE_URL}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: `<h1>Click <a href="${confirmationUrl}">here</a> to reset your password</h1>`,
    });
};
