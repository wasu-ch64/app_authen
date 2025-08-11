// client/src/types

declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
  }

  export const Eye: React.FC<LucideProps>;
  export const EyeOff: React.FC<LucideProps>;
  export const Squirrel: React.FC<LucideProps>;
  export const Menu: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const CircleAlert: React.FC<LucideProps>;
  export const Pencil: React.FC<LucideProps>;
  export const Trash2: React.FC<LucideProps>;
}
