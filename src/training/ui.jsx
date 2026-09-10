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
      className={`w-full h-full grid place-items-center bg-stone-100 text-stone-500 ${className}`}
      aria-label="사진 준비 중"
    >
      <ImageIcon size={26} strokeWidth={1.5} />
    </div>
  );
}

// 사진 카드. 기울이지 않고 반듯하게 놓습니다.
export function Polaroid({ src, alt, caption, className = '' }) {
  return (
    <figure className={`bg-white border border-stone-300 rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-[4/3]">
        <Photo src={src} alt={alt} />
      </div>
      {caption && (
        <figcaption className="px-3 py-2 text-center text-[15px] text-stone-700">{caption}</figcaption>
      )}
    </figure>
  );
}

// 화면 제목. 왼쪽 남색 띠 하나로만 구분합니다.
export function PageTitle({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-5 border-l-[6px] border-navy-800 pl-3 py-1">
      {Icon && <Icon size={24} className="shrink-0 text-navy-800" aria-hidden="true" />}
      <h2 className="text-[22px] font-bold text-navy-900 leading-snug">{children}</h2>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <section className={`bg-white border border-stone-300 rounded-lg p-5 ${className}`}>
      {children}
    </section>
  );
}

export function BackButton({ to = 'home', param, label = '되돌아가기' }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to, param)}
      className="inline-flex items-center justify-center gap-2 min-h-[52px] rounded-lg border-2 border-navy-800 bg-white px-6 text-[17px] font-bold text-navy-800"
    >
      <ArrowLeft size={20} /> {label}
    </button>
  );
}

// 바깥 링크 단추. 화면 너비를 다 쓰고 높이는 56px 이상입니다.
export function LinkButton({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center gap-2 min-h-[56px] rounded-lg bg-navy-800 px-5 py-3 text-[18px] font-bold text-white ${className}`}
    >
      {children} <ExternalLink size={19} aria-hidden="true" />
    </a>
  );
}
