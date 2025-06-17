import { IconType } from 'react-icons';
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
} from 'react-icons/io5';

interface NavigateLink {
    href: string;
    title: string;
    Icon: IconType;
    IconOutline: IconType;
}

interface NavigateLinks {
    [key: string]: NavigateLink;
}

const NAVIGATE_LINKS = {
    HOME: {
        href: '/',
        title: 'Home',
        Icon: IoHomeSharp,
        IconOutline: IoHomeOutline,
    },
    FRIENDS: {
        href: '/friends',
        title: 'Friends',
        Icon: IoPeople,
        IconOutline: IoPeopleOutline,
    },
    STORIES: {
        href: '/stories',
        title: 'Stories',
        Icon: IoBook,
        IconOutline: IoBookOutline,
    },
    GROUP: {
        href: '/groups',
        title: 'Groups',
        Icon: IoExtensionPuzzle,
        IconOutline: IoExtensionPuzzleOutline,
    },
    PROFILE: {
        href: '/profile',
        title: 'Profile',
        Icon: IoPerson,
        IconOutline: IoPersonOutline,
    },
    SETTINGS: {
        href: '/settings',
        title: 'Settings',
        Icon: IoSettings,
        IconOutline: IoSettingsOutline,
    },
    LOGIN: {
        href: '/auth/sign-in',
        title: 'Login',
        Icon: IoLogIn,
        IconOutline: IoLogInOutline,
    },
    LOGOUT: {
        href: '/',
        title: 'Logout',
        Icon: IoLogOut,
        IconOutline: IoLogOutOutline,
    },
    REGISTER: {
        href: '/auth/sign-up',
        title: 'Sign Up',
        Icon: IoCreate,
        IconOutline: IoCreateOutline,
    },
} satisfies NavigateLinks;

export const {
    HOME,
    FRIENDS,
    STORIES,
    GROUP,
    PROFILE,
    SETTINGS,
    LOGIN,
    LOGOUT,
    REGISTER,
} = NAVIGATE_LINKS;

export const linksList = Object.values(
    NAVIGATE_LINKS
) as (typeof NAVIGATE_LINKS)[keyof typeof NAVIGATE_LINKS][];

export default NAVIGATE_LINKS;
