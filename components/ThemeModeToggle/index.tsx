'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { isArrayNonNullable } from '@/helpers';
import { useTheme } from '@/context/ThemeContext';
import ToggleElement from './ToggleElement';
import cn from 'classnames';

interface ThemeModeToggleProps extends HTMLMotionProps<'div'> {
    layoutId?: string;
    toggleThemeModes: [string, string];
}

const ThemeModeToggle = ({
    toggleThemeModes,
    layoutId = 'ToggleThemeModeItem',
    className,
    ...restProps
}: ThemeModeToggleProps) => {
    const { themeMode, icons, setThemeMode, findThemeMode } = useTheme();

    const toggleThemeModesSettings = toggleThemeModes.map((item) =>
        findThemeMode(item)
    );

    if (!isArrayNonNullable(toggleThemeModesSettings)) return;

    const handlerClick = () => {
        const [firstThemeMode, secondThemeMode] = toggleThemeModes;
        setThemeMode(
            themeMode === firstThemeMode ? secondThemeMode : firstThemeMode
        );
    };

    return (
        <motion.div
            onClick={handlerClick}
            className={cn(
                'relative w-12 h-6 p-0.5 bg-innerBG rounded-full flex justify-between items-center cursor-pointer hover:shadow-lg hover:shadow-mainBG transition-all',
                className
            )}
            {...restProps}
        >
            {toggleThemeModesSettings.map((themeModeSettings, index) => (
                <div
                    key={`${layoutId}-${index}`}
                    className="relative h-full aspect-square rounded-full"
                >
                    <themeModeSettings.icons.Outline
                        title={themeModeSettings.themeMode}
                        className="absolute inset-0 content-center w-full h-full text-innerText"
                    />
                    <ToggleElement
                        layoutId={layoutId}
                        isFirst={index === 0}
                        isSelected={themeMode === themeModeSettings.themeMode}
                        onDragAction={handlerClick}
                        title={themeModeSettings.themeMode}
                        Icon={icons.Fill}
                    />
                </div>
            ))}
        </motion.div>
    );
};

export default ThemeModeToggle;
