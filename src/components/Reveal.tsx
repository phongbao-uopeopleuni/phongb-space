import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type Props = {
  children: ReactNode;
  /** 'up' mo dan + dich len 14px; 'left' truot tu ben trai (dung cho dai so lieu) */
  variant?: 'up' | 'left';
  /** Do tre theo bac, de cac the trong mot luoi hien noi tiep nhau */
  delay?: number;
  className?: string;
  as?: ElementType;
};

export function Reveal({ children, variant = 'up', delay = 0, className = '', as }: Props) {
  const ref = useReveal<HTMLElement>();
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      ref={ref}
      className={`${variant === 'left' ? 'reveal-left' : 'reveal'} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
