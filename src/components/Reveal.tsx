import type { ElementType, ReactNode } from 'react';

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
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      className={className}
      data-reveal={variant}
      data-reveal-delay={delay || undefined}
    >
      {children}
    </Tag>
  );
}
