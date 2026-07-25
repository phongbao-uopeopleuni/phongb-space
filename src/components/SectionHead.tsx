import { Reveal } from './Reveal';

type Props = {
  /** Nhan phu de dang comment code: `// ten-muc` */
  eyebrow: string;
  title: string;
  /** Dong lenh gia `$ ten-lenh` — chi dung cho muc co tinh liet ke */
  cmd?: string;
  lede?: string;
};

export function SectionHead({ eyebrow, title, cmd, lede }: Props) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg md:text-3xl">{title}</h2>
      {cmd && <p className="cmd mt-3">{cmd}</p>}
      {lede && <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{lede}</p>}
    </Reveal>
  );
}
