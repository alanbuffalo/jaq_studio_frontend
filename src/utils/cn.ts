import { clsx } from 'clsx';

export const cn = (...classes: Array<string | false | null | undefined>) => clsx(classes);

