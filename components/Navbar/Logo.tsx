import { HOME } from '@/helpers/NAVIGATE_LINKS';
import Link, { LinkProps } from 'next/link';

interface LogoProps
    extends Omit<React.HTMLProps<HTMLAnchorElement>, 'as'>,
        Omit<LinkProps, 'href'> {
    href?: string;
    children?: React.ReactNode;
}

const Logo = ({ href, children, ...restProps }: LogoProps) => {
    const linkProps = {
        ...restProps,
    };

    const content = children ? children : 'Mogo.Dev';

    return (
        <Link
            className="text-secondaryText"
            href={href ? href : HOME.href}
            {...linkProps}
        >
            {content}
        </Link>
    );
};

export default Logo;
