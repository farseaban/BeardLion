import { Home as HomeIcon, CalendarDays, Map, BookOpen, CheckCircle2 } from 'lucide-react';
import { meta, nav } from './content';
import { useHashRoute, navigate } from './useHashRoute';
import { Home, Schedule, Course, Guide, Materials, Participate } from './pages';

const icons = {
  home: HomeIcon,
  schedule: CalendarDays,
  course: Map,
  materials: BookOpen,
  participate: CheckCircle2,
};

function Screen({ page, param }) {
  switch (page) {
    case 'schedule':
      return <Schedule />;
    case 'course':
      return <Course />;
    case 'guide':
      return <Guide id={param} />;
    case 'materials':
      return <Materials />;
    case 'participate':
      return <Participate />;
    default:
      return <Home />;
  }
}

export default function TrainingSite() {
  const { page, param } = useHashRoute();
  // 장소 소개 화면은 코스 메뉴를 켜 둡니다.
  const active = page === 'guide' ? 'course' : page;

  return (
    <div className="min-h-dvh bg-stone-300 text-ink">
      <div className="mx-auto max-w-md min-h-dvh bg-paper flex flex-col">
        <header className="px-4 pt-4 pb-3 border-b border-stone-300">
          <p className="text-[15px] font-bold text-navy-800">{meta.org}</p>
          {page !== 'home' && (
            <p className="text-[15px] text-stone-700 mt-0.5">
              {meta.year} {meta.title}
            </p>
          )}
        </header>

        <main className="flex-1 px-4 pb-32 pt-5">
          <Screen page={page} param={param} />
        </main>

        {/* 하단 메뉴. 한글 이름을 크게 보여 주고 그림은 거들기만 합니다. */}
        <nav
          aria-label="주요 메뉴"
          className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-white border-t-2 border-navy-800"
        >
          <ul className="grid grid-cols-5 gap-1 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {nav.map((n) => {
              const Icon = icons[n.id];
              const on = active === n.id;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => navigate(n.id)}
                    aria-current={on ? 'page' : undefined}
                    className={`w-full min-h-[60px] flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 ${
                      on ? 'bg-navy-800 text-white' : 'text-navy-800'
                    }`}
                  >
                    <Icon size={21} strokeWidth={on ? 2.4 : 2} aria-hidden="true" />
                    <span className="text-[15px] font-bold whitespace-nowrap leading-none">{n.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
