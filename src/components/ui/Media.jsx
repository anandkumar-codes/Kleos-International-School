import { useState } from 'react';
import {
  GraduationCap, MonitorSmartphone, School, Trophy, ShieldCheck, Sparkles, Presentation, Library, Monitor, FlaskConical,
  Bus, HeartPulse, UtensilsCrossed, Palette, Theater, Image as ImageIcon,
} from 'lucide-react';
import { initials } from '../../utils/format';
import { hashString } from '../../utils/random';

// Content stores icon names as strings so the CMS can edit them.
export const ICONS = { GraduationCap, MonitorSmartphone, School, Trophy, ShieldCheck, Sparkles, Presentation, Library, Monitor, FlaskConical, Bus, HeartPulse, UtensilsCrossed, Palette, Theater };
export const ICON_NAMES = Object.keys(ICONS);
export function Icon({ name, ...rest }) {
  const C = ICONS[name] || Sparkles;
  return <C aria-hidden {...rest} />;
}

/** Image with a fade-in on load and a branded fallback if the source fails. */
export function SmartImage({ src, alt = '', className = '', style, ratio, eager, imgClassName = '' }) {
  const [state, setState] = useState(src ? 'loading' : 'error');
  return (
    <div className={`smart-img ${className}`} style={{ aspectRatio: ratio, ...style }}>
      {src && state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`${state === 'loaded' ? 'is-loaded' : ''} ${imgClassName}`}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      )}
      {state === 'error' && (
        <div className="smart-img__fallback" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
          <ImageIcon />
        </div>
      )}
    </div>
  );
}

const AVATAR_COLORS = ['#0b4d3a', '#177a5b', '#c8323c', '#2d7dd2', '#7f56c8', '#d98a10', '#0e7490', '#9d4e8a', '#4d7c0f'];
export function Avatar({ name = '', src, size = 38, className = '' }) {
  const bg = AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];
  return (
    <span className={`avatar ${className}`} style={{ '--size': `${size}px`, background: src ? undefined : `linear-gradient(135deg, ${bg}, ${bg}cc)` }} aria-hidden>
      {src ? <img src={src} alt="" /> : initials(name)}
    </span>
  );
}

/* ---------- Brand ---------- */
export function LogoMark({ size = 44, light }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light ? '#ffffff' : '#10624a'} />
          <stop offset="1" stopColor={light ? '#e3f1eb' : '#083a2c'} />
        </linearGradient>
      </defs>
      <path d="M32 3 56 12v20c0 15-10.5 25.5-24 29C18.5 57.5 8 47 8 32V12Z" fill="url(#lm-g)" />
      <path d="M32 7.5 52 15v17c0 12.6-8.6 21.6-20 24.8C20.6 53.6 12 44.6 12 32V15Z" fill="none" stroke={light ? '#0b4d3a' : '#e8a53b'} strokeOpacity=".55" strokeWidth="1.2" />
      {/* laurel */}
      <g fill="#e8a53b">
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={`l${i}`} cx={18.5 + i * 1.2} cy={44 - i * 6.2} rx="2.1" ry="4" transform={`rotate(${-38 + i * 9} ${18.5 + i * 1.2} ${44 - i * 6.2})`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={`r${i}`} cx={45.5 - i * 1.2} cy={44 - i * 6.2} rx="2.1" ry="4" transform={`rotate(${38 - i * 9} ${45.5 - i * 1.2} ${44 - i * 6.2})`} />
        ))}
      </g>
      <path d="M26.5 21v24M26.5 34.5 38 21M30.5 30.6 39 45" stroke={light ? '#0b4d3a' : '#ffffff'} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Logo({ light, compact, sub = 'International School · CBSE' }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <LogoMark light={false} />
      {!compact && (
        <span className="logo__text">
          <span className="logo__name">KLEOS</span>
          <span className="logo__sub">{sub}</span>
        </span>
      )}
    </span>
  );
}

/* ---------- Social icons (brand marks aren't in lucide) ---------- */
const SOCIAL_PATHS = {
  facebook: 'M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 5.9v2.6H8v3.8h2.2V22h3.8v-9.7h2.9l.4-3.8H14Z',
  instagram: 'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1.1-.1-1.4-.1-4.1s0-3 .1-4.1C3.9 5.1 5.2 3.8 7.9 3.7c1.1-.1 1.4-.1 4.1-.1ZM12 2C9.3 2 8.9 2 7.8 2.1 4.2 2.2 2.2 4.2 2.1 7.8 2 8.9 2 9.3 2 12s0 3.1.1 4.2c.1 3.6 2.1 5.6 5.7 5.7 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c3.6-.1 5.6-2.1 5.7-5.7.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c-.1-3.6-2.1-5.6-5.7-5.7C15.1 2 14.7 2 12 2Z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z',
  linkedin: 'M6.5 8.8H3V21h3.5V8.8ZM4.8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM21 14c0-3.3-.7-5.5-4.4-5.5-1.8 0-3 .7-3.5 1.6V8.8H9.8V21h3.5v-6c0-1.6.3-3.1 2.3-3.1 1.9 0 2 1.8 2 3.2V21H21v-7Z',
};
export function SocialIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={SOCIAL_PATHS[name]} />
    </svg>
  );
}
