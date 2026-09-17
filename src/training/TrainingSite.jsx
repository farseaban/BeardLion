import { useEffect, useState } from 'react';
import { meta, guides } from './content';
import { Home, Schedule, Course, Guide, Materials, Participate } from './pages';

// ── A안 : 한 장 스크롤 ────────────────────────────────────
// 화면을 나누지 않습니다. 표지부터 참여까지 한 페이지에 세로로 잇습니다.
// 누를 곳을 고르지 않아도 아래로 내리면 전부 나옵니다. 종이 안내장에 가깝습니다.
// 바로가기 띠는 화면 맨 아래에 붙여 둡니다. 엄지가 닿는 자리이고,
// 스크롤이 길어져도 항상 보입니다.

const sections = [
  { id: 'sec-home', label: '안내' },
  { id: 'sec-schedule', label: '일정' },
  { id: 'sec-course', label: '코스' },
  { id: 'sec-materials', label: '자료' },
  { id: 'sec-participate', label: '참여' },
];

function Jump() {
  const [here, setHere] = useState('sec-home');

  // 지금 어느 절을 보고 있는지 매 스크롤마다 다시 고릅니다.
  // 화면 위쪽 30% 선을 지난 절 가운데 마지막 것이 현재 절입니다.
  // 문서 끝에 닿으면 마지막 절로 둡니다. 마지막 절은 그 선까지 올라오지 못하기 때문입니다.
  useEffect(() => {
    const pick = () => {
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setHere(sections[sections.length - 1].id);
        return;
      }
      const line = window.innerHeight * 0.3;
      let cur = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) cur = s.id;
      }
      setHere(cur);
    };
    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  return (
    <nav
      aria-label="바로가기"
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-accent bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={here === s.id ? 'true' : undefined}
              className={`flex min-h-[60px] items-center justify-center text-[16px] font-bold ${
                here === s.id ? 'bg-accent text-onAccent' : 'text-accent'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Band({ id, children }) {
  return (
    <section id={id} className="scroll-mt-4 pt-8 first:pt-4">
      {children}
    </section>
  );
}

export default function TrainingSite() {
  return (
    <div className="min-h-dvh bg-edge text-ink">
      <div className="mx-auto max-w-md min-h-dvh bg-paper flex flex-col">
        <header className="px-4 pt-4 pb-3">
          <p className="text-[15px] font-bold text-accent">{meta.org}</p>
        </header>

        <main className="flex-1 px-4 pb-28">
          <Band id="sec-home">
            <Home />
          </Band>

          <Band id="sec-schedule">
            <Schedule />
          </Band>

          <Band id="sec-course">
            <Course />
            {/* 장소 소개도 따로 들어가지 않고 코스 아래에 이어 붙습니다. */}
            <div className="mt-8 space-y-8">
              {Object.keys(guides).map((id) => (
                <Guide key={id} id={id} inline />
              ))}
            </div>
          </Band>

          <Band id="sec-materials">
            <Materials />
          </Band>

          <Band id="sec-participate">
            <Participate />
          </Band>

          <p className="mt-12 pt-6 border-t border-line text-center text-[15px] text-muted">
            {meta.dept} {meta.contact.role} {meta.contact.name} ·{' '}
            <a href={`tel:${meta.contact.phone}`} className="font-bold text-accent underline">
              {meta.contact.phone}
            </a>
          </p>
        </main>

        <Jump />
      </div>
    </div>
  );
}
