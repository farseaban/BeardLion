import { ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { navigate } from './useHashRoute';

const base = import.meta.env.BASE_URL;

// 사진 자리. 파일명이 없으면 자리표시 그림을 보여 줍니다.
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
      className={`w-full h-full grid place-items-center bg-gradient-to-br from-amber-100 to-stone-200 text-stone-400 ${className}`}
      aria-label="사진 준비 중"
    >
      <ImageIcon size={28} strokeWidth={1.5} />
    </div>
  );
}

// 폴라로이드 느낌의 사진 카드
export function Polaroid({ src, alt, caption, className = '' }) {
  return (
    <figure className={`bg-white p-2 pb-3 shadow-md rounded-sm ${className}`}>
      <div className="aspect-[4/3] overflow-hidden rounded-sm">
        <Photo src={src} alt={alt} />
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-stone-600">{caption}</figcaption>}
    </figure>
  );
}

// 화면 제목 띠
export function PageTitle({ children, icon }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {icon && <span className="text-3xl leading-none" aria-hidden="true">{icon}</span>}
      <h2 className="flex-1 bg-white border-2 border-stone-700 shadow-[4px_4px_0_#44403c] px-4 py-2 text-xl font-bold tracking-wide text-stone-800">
        {children}
      </h2>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <section className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>{children}</section>;
}

export function BackButton({ to = 'home', param, label = '되돌아가기' }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to, param)}
      className="inline-flex items-center gap-2 rounded-full bg-orange-500 text-white px-4 py-2 font-semibold shadow active:scale-95 transition"
    >
      <ArrowLeft size={18} /> {label}
    </button>
  );
}

export function LinkButton({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-700 bg-white px-6 py-3 text-lg font-bold text-amber-800 shadow-md active:scale-95 transition ${className}`}
    >
      {children} <ExternalLink size={18} />
    </a>
  );
}
