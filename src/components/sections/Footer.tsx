import { Facebook, Github } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT } from '../../data/config';
import { Typewriter } from '../Typewriter';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const links = [
    { href: CONTACT.github, label: 'GitHub', Icon: Github },
    { href: CONTACT.facebook, label: 'Facebook', Icon: Facebook },
  ];

  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.75rem] leading-relaxed text-muted">
          <Typewriter text={t.footer.copyright(year)} />
        </p>

        <nav aria-label={t.footer.social}>
          <ul className="flex items-center gap-4">
            {links.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[0.75rem] text-muted transition-colors hover:text-accent"
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
