import Image from "next/image";
import SectionLink from "@/components/SectionLink/SectionLink";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import FeedbackForm from "@/components/FeedbackForm/FeedbackForm";
import { getStoreHours } from "@/lib/catalog";
import { formatClockL, getDict, num } from "@/lib/i18n";
import { getLang } from "@/lib/langServer";
import "./Footer.css";

/* Simple inline social icons (no extra package needed) */
const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const socials = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg {...iconProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg {...iconProps}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg {...iconProps}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
];

export default async function Footer() {
  const lang = await getLang();
  const t = getDict(lang);
  const hours = await getStoreHours();
  const year = num(lang, new Date().getFullYear(), { useGrouping: false });

  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <Reveal direction="left">
            <div className="footer-brand">
              <SectionLink section="home" className="footer-logo">
                <Image
                  src="/logo.png"
                  alt={t.nav.logoAlt}
                  width={56}
                  height={56}
                />
                <span>{t.brand.full}</span>
              </SectionLink>
              <p className="footer-about">{t.footer.about}</p>

              <div className="footer-socials">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="footer-social"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <div className="footer-contact-box">
              <h4 className="footer-heading">{t.footer.contact}</h4>
              <ul className="footer-list">
                <li className="footer-contact">
                  <MapPin size={18} />
                  <span>{t.footer.address}</span>
                </li>
                <li className="footer-contact">
                  <Phone size={18} />
                  <span dir="ltr">+20 100 000 0000</span>
                </li>
                <li className="footer-contact">
                  <Mail size={18} />
                  <span dir="ltr">hello@bahrawyplanet.com</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {hours.length > 0 && (
            <Reveal direction="right" delay={200}>
              <div className="footer-hours-box">
                <h4 className="footer-heading">
                  <Clock size={18} /> {t.footer.hours}
                </h4>
                <ul className="footer-hours">
                  {hours.map((h) => (
                    <li key={h.weekday} className="footer-hours-row">
                      <span>{t.weekdays[h.weekday] ?? `Day ${h.weekday}`}</span>
                      {h.is_closed ? (
                        <span className="footer-closed">{t.footer.closed}</span>
                      ) : (
                        <span>
                          {formatClockL(lang, h.opens_at)} -{" "}
                          {formatClockL(lang, h.closes_at)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal direction="up">
          <FeedbackForm />
        </Reveal>

        <div className="footer-bottom">
          <p>
            © {year} {t.brand.full}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}