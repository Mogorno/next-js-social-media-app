import {
    IoPeople,
    IoPeopleOutline,
    IoHomeSharp,
    IoHomeOutline,
    IoBook,
    IoBookOutline,
    IoExtensionPuzzle,
    IoExtensionPuzzleOutline,
    IoPerson,
    IoPersonOutline,
    IoSettings,
    IoSettingsOutline,
    IoLogIn,
    IoLogInOutline,
    IoLogOut,
    IoLogOutOutline,
    IoCreate,
    IoCreateOutline,
    IoWarning,
    IoWarningOutline,
    IoHammer,
    IoHammerOutline,
    IoLockOpen,
    IoLockOpenOutline,
} from 'react-icons/io5';
import { AppLink } from '@/helpers/AppLink';

export const HOME = new AppLink(
    '/',
    'Home',
    IoHomeSharp,
    IoHomeOutline,
    'public'
);
export const FRIENDS = new AppLink(
    '/friends',
    'Friends',
    IoPeople,
    IoPeopleOutline,
    'protected'
);
export const STORIES = new AppLink(
    '/stories',
    'Stories',
    IoBook,
    IoBookOutline,
    'protected'
);
export const GROUP = new AppLink(
    '/groups',
    'Groups',
    IoExtensionPuzzle,
    IoExtensionPuzzleOutline,
    'protected'
);

export const PROFILE = new AppLink(
    '/profile',
    'Profile',
    IoPerson,
    IoPersonOutline,
    'protected'
);
export const SETTINGS = new AppLink(
    '/settings',
    'Settings',
    IoSettings,
    IoSettingsOutline,
    'protected'
);
export const LOGOUT = new AppLink(
    '/',
    'Logout',
    IoLogOut,
    IoLogOutOutline,
    'public'
);
export const LOGIN = new AppLink(
    '/auth/sign-in',
    'Login',
    IoLogIn,
    IoLogInOutline,
    'auth'
);
export const REGISTER = new AppLink(
    '/auth/sign-up',
    'Sign Up',
    IoCreate,
    IoCreateOutline,
    'auth'
);
export const AUTH_ERROR = new AppLink(
    '/auth/error',
    'Error',
    IoWarning,
    IoWarningOutline,
    'auth'
);
export const AUTH_NEW_VERIFICATION = new AppLink(
    '/auth/new-verification',
    'New Verification',
    IoWarning,
    IoWarningOutline,
    'auth'
);

export const AUTH_RESET = new AppLink(
    '/auth/reset',
    'Reset Password',
    IoHammer,
    IoHammerOutline,
    'auth'
);

export const AUTH_NEW_PASSWORD = new AppLink(
    '/auth/new-password',
    'New Password',
    IoLockOpen,
    IoLockOpenOutline,
    'auth'
);

export const API_UPLOADTHING = new AppLink(
    '/api/uploadthing',
    'Uploadthing',
    IoHomeSharp,
    IoHomeOutline,
    'protected'
);

const appLinks = [
    HOME,
    FRIENDS,
    STORIES,
    GROUP,
    PROFILE,
    SETTINGS,
    LOGIN,
    LOGOUT,
    REGISTER,
    AUTH_ERROR,
    AUTH_NEW_VERIFICATION,
    AUTH_RESET,
    AUTH_NEW_PASSWORD,
    API_UPLOADTHING,
];

export default appLinks;

export const publicRoutes = appLinks.reduce<string[]>((acc, link) => {
    if (link.routeType === 'public') {
        acc.push(link.pathname);
    }
    return acc;
}, []);

export const authRoutes = appLinks.reduce<string[]>((acc, link) => {
    if (link.routeType === 'auth') {
        acc.push(link.pathname);
    }
    return acc;
}, []);

export const apiAuthPrefix = '/api/auth';

export const publicApiRoutes: string[] = [apiAuthPrefix, '/api/uploadthing'];

export const protectedApiRoutes: string[] = [];

export const DEFAULT_LOGIN_REDIRECT = SETTINGS.href;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
