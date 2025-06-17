'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ThemeModeToggle from '@/components/ThemeModeToggle';
import PopoverButton from './PopoverButton';
import { useTheme } from '@/context/ThemeContext';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import ModalMenu from '@/components/ModalMenu';
import MotionList from '@/components/ui/MotionList';
import { IconBaseProps, IconType } from 'react-icons';

type ToggleThemeMode = [string, string];

const ThemeController = () => {
    const { themeMode, setThemeMode, themeModesIcons, defaultThemeMode } =
        useTheme();

    const toggleThemeModesByDefault: ToggleThemeMode = useMemo(
        () => [themeMode, themeMode === 'light' ? 'dark' : 'light'],
        [themeMode]
    );

    const [toggleThemeModes, setToggleThemeModes] = useState(
        toggleThemeModesByDefault
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const toggleThemeModes = localStorage.getItem('toggleThemeModes');

        if (!toggleThemeModes) return;

        const parsedToggleThemeModes: ToggleThemeMode =
            JSON.parse(toggleThemeModes);

        if (Array.isArray(parsedToggleThemeModes)) {
            return setToggleThemeModes(parsedToggleThemeModes);
        } else {
            localStorage?.setItem(
                'toggleThemeModes',
                JSON.stringify(toggleThemeModesByDefault)
            );
            return setToggleThemeModes(toggleThemeModesByDefault);
        }
    }, [setToggleThemeModes, toggleThemeModesByDefault]);

    const indexOfSelectedToggleThemeMode = toggleThemeModes.indexOf(themeMode);

    const [isOpenPopoverButton, setIsOpenPopoverButton] = useDebouncedValue(
        false,
        { delay: 500, initialDelay: true }
    );

    const [isOpenModalMenu, setIsOpenModalMenu] = useDebouncedValue(false, {
        delay: 1000,
        staticTimeout: true,
    });

    const handleSetThemeMode = (newThemeMode: string) => {
        if (toggleThemeModes.includes(newThemeMode)) {
            setThemeMode(newThemeMode);
        } else if (indexOfSelectedToggleThemeMode !== -1) {
            setToggleThemeModes((prev) => {
                const newToggleThemeModes = [...prev] as ToggleThemeMode;
                newToggleThemeModes[indexOfSelectedToggleThemeMode] =
                    newThemeMode;
                localStorage.setItem(
                    'toggleThemeModes',
                    JSON.stringify(newToggleThemeModes)
                );
                return newToggleThemeModes;
            });
            setThemeMode(newThemeMode);
        }
    };

    return (
        <motion.div
            onHoverStart={() => setIsOpenPopoverButton(true)}
            onHoverEnd={() => (
                setIsOpenPopoverButton(false), setIsOpenModalMenu(false)
            )}
            className="relative"
        >
            <ThemeModeToggle
                className={
                    isOpenModalMenu || isOpenPopoverButton ? 'z-50' : 'z-30'
                }
                toggleThemeModes={toggleThemeModes}
            />
            <PopoverButton
                isOpen={isOpenPopoverButton}
                isRotateIcon={isOpenModalMenu}
                onClick={() => setIsOpenModalMenu((prev) => !prev)}
            />
            <ModalMenu
                isOpen={isOpenModalMenu && isOpenPopoverButton}
                setIsOpen={setIsOpenModalMenu}
                className="z-10 absolute top-0 -left-1/2 translate-x-1/2 w-full bg-secondaryBG rounded-xl flex justify-end overflow-hidden shadow-mainBG shadow-md"
                whileOpenStyle={{
                    width: '250%',
                    height: '176px',
                }}
            >
                <MotionList className="z-10 p-2 pt-7">
                    {Object.keys(themeModesIcons).map((tm, index) => (
                        <MotionList.Item
                            key={`themeModeItem-${index}`}
                            className={`flex justify-start items-center gap-2 py-0 px-1.5 ${
                                themeMode === tm && 'bg-mainBG'
                            }`}
                            onClick={() => handleSetThemeMode(tm)}
                        >
                            <Icon
                                className="h-full aspect-square flex-5"
                                selected={themeMode === tm}
                                IconFill={themeModesIcons[tm].Fill}
                                IconOutline={themeModesIcons[tm].Outline}
                                IconByDefault={defaultThemeMode.icons.Fill}
                            />
                            <span className="overflow-hidden whitespace-nowrap text-ellipsis flex-1">
                                {tm}
                            </span>
                        </MotionList.Item>
                    ))}
                </MotionList>
            </ModalMenu>
        </motion.div>
    );
};

interface IconProps extends IconBaseProps {
    selected: boolean;
    IconFill?: IconType;
    IconOutline?: IconType;
    IconByDefault: IconType;
}

const Icon = ({
    selected,
    IconFill,
    IconOutline,
    IconByDefault,
    ...restProps
}: IconProps) => {
    if (selected && IconFill) return <IconFill {...restProps} />;
    if (!selected && IconOutline) return <IconOutline {...restProps} />;
    return <IconByDefault {...restProps} />;
};

export default ThemeController;
