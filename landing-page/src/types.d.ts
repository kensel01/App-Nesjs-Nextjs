declare module 'react';
declare module 'react/jsx-runtime';
declare module 'lucide-react';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
} 