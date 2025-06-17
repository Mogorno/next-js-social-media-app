import { linksList } from '@/helpers/NAVIGATE_LINKS';
import cn from 'classnames';
import NavLink from './NavLink';

interface NavLinksProps extends React.ComponentProps<'ul'> {
    childrenClassName?: React.ComponentProps<'li'>['className'];
}
const NavLinks = ({
    className,
    childrenClassName,
    ...restProps
}: NavLinksProps) => {
    const availableLinks = ['Home', 'Friends', 'Stories', 'Settings'];

    const links = linksList.filter(({ title }) =>
        availableLinks.includes(title)
    );

    return (
        <ul
            className={cn(
                'hidden md:flex justify-between items-center gap-2',
                className
            )}
            {...restProps}
        >
            {links.map(({ title, href, Icon, IconOutline }, index) => (
                <li key={`${title}-${index}`} className={childrenClassName}>
                    <NavLink
                        Icons={[IconOutline, Icon]}
                        title={title}
                        href={href}
                    />
                </li>
            ))}
        </ul>
    );
};

export default NavLinks;
