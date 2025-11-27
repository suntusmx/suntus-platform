// Exportar todos los átomos
export { Typography } from './Typography';
export type { TypographyProps } from './Typography';

export { ButtonBase } from './ButtonBase';
export type { ButtonBaseProps } from './ButtonBase';

// Input se resuelve automáticamente a .native.tsx o .web.tsx según la plataforma
// En web, Next.js prioriza .web.tsx; en mobile, Metro prioriza .native.tsx
export { Input } from './Input.web';
export type { InputProps } from './Input.web';

export { Icon } from './Icon';
export type { IconProps } from './Icon';

