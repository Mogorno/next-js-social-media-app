import { ClassNameValue } from 'tailwind-merge';

type Variants<T extends string> = {
    [K in T]: ClassNameValue;
};

export interface CSSVariants<
    Style extends string,
    Status extends string,
    Size extends string,
> {
    style: Variants<Style>;
    status: Variants<Status>;
    size: Variants<Size>;
}
