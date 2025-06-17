import { twMerge, ClassNameValue } from 'tailwind-merge';

export type Variants = 'style' | 'status' | 'size';

export type VariantConfig = {
    [key in Variants]?: Record<string, ClassNameValue>;
};

export type DefaultVariants<T extends VariantConfig> = {
    [K in keyof T]: T[K] extends Record<string, ClassNameValue>
        ? keyof T[K]
        : never;
};

export default function twVariantMerge<T extends VariantConfig>(
    config: Partial<T>,
    defaultVariants?: Partial<DefaultVariants<T>>
) {
    return function (
        styleKey?: keyof T['style'],
        statusKey?: keyof T['status'],
        sizeKey?: keyof T['size'],
        ...classLists: ClassNameValue[]
    ) {
        return twMerge(
            config.style?.[
                typeof styleKey === 'string' && styleKey in config.style
                    ? styleKey
                    : (defaultVariants?.style ?? 'primary')
            ],
            config.status?.[
                typeof statusKey === 'string' && statusKey in config.status
                    ? statusKey
                    : (defaultVariants?.status ?? 'default')
            ],
            config.size?.[
                typeof sizeKey === 'string' && sizeKey in config.size
                    ? sizeKey
                    : (defaultVariants?.size ?? 'md')
            ],
            ...classLists
        );
    };
}
