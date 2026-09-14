import { ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { navigate } from './useHashRoute';

const base = import.meta.env.BASE_URL;

export function Photo({ src, alt = '', className = '' }) {
  if (src) {
    return (
      <img
        src={`${base}photos/${src}`}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`w-full h-full grid place-items-center bg-soft text-muted ${className}`}
      aria-label="사진 준비 중"
    >
      <ImageIcon size={26} strokeWidth={1.5} />
    </div>
  );
}

export function Polaroid({ src, alt, caption, className = '' }) {
  return (
    <figure className={`bg-card border border-line rounded-box overflow-hidden ${className}`}>
      <div className="aspect-[4/3]">
        <Photo src={src} alt={alt} />
      </div>
      {caption && <figcaption className="px-3 py-2 text-center text-[15px] text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function PageTitle({ children }) {
  return (
    <div className="mb-5 border-l-[6px] border-accent pl-3 py-1">
      <h2 className="text-[22px] font-bold text-accent leading-snug">{children}</h2>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <section className={`bg-card border border-line rounded-box p-5 ${className}`}>{children}</section>;
}

export function BackButton({ to = 'home', param, label = '되돌아가기' }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to, param)}
      className="inline-flex items-center justify-center gap-2 min-h-[52px] rounded-pill border-2 border-accent bg-card px-6 text-[17px] font-bold text-accent"
    >
      <ArrowLeft size={20} /> {label}
    </button>
  );
}

// 아직 주소를 받지 못한 자리표시 링크인지 봅니다.
// content.js에 example.com 주소가 남아 있으면 참가자에게 빈 쪽이 열립니다.
// 그래서 누를 수 없는 '준비 중' 단추로 바꿔 둡니다. 실제 주소를 넣으면 저절로 살아납니다.
function isPlaceholderUrl(href) {
  return !href || href.includes('example.com');
}

export function LinkButton({ href, children, className = '' }) {
  const base = `flex w-full items-center justify-center gap-2 min-h-[56px] rounded-pill px-5 py-3 text-[18px] font-bold ${className}`;

  if (isPlaceholderUrl(href)) {
    return (
      <p className={`${base} border-2 border-dashed border-line bg-soft text-muted`}>
        {children} · 준비 중
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-accent text-onAccent`}
    >
      {children} <ExternalLink size={19} aria-hidden="true" />
    </a>
  );
}
