import { IconType } from 'react-icons';
import { IoHomeOutline, IoHomeSharp } from 'react-icons/io5';

export class AppLink extends URL {
    routeType: 'public' | 'protected' | 'auth';
    title: string;
    Icon: IconType;
    IconOutline: IconType;

    protected initializeTitle(title: string | undefined): string {
        if (typeof title === 'string') return title;

        const segment = this.pathname.split('/')[1];

        return segment.length >= 3
            ? segment[0].toUpperCase() + segment.slice(1)
            : 'Default Title';
    }

    constructor(
        url: string | URL | AppLink,
        title?: string,
        Icon?: IconType,
        IconOutline?: IconType,
        routeType?: 'public' | 'protected' | 'auth'
    ) {
        const base = process.env.NEXT_PUBLIC_BASE_URL;

        if (!base) {
            throw new Error(
                'Base URL (process.env.NEXT_PUBLIC_BASE_URL) is not defined'
            );
        }

        if (url instanceof AppLink) {
            super(url.href);
            title = title || url.title;
            Icon = Icon || url.Icon;
            IconOutline = IconOutline || url.IconOutline;
            routeType = routeType || url.routeType;
        } else if (url instanceof URL) {
            super(`${base}${url.pathname}`);
        } else {
            super(url, base);
        }

        this.title = this.initializeTitle(title);

        this.routeType = routeType || 'protected';

        this.Icon = Icon || IoHomeSharp;

        this.IconOutline = IconOutline || IoHomeOutline;
    }
}
