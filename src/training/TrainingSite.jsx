import { Home as HomeIcon, CalendarDays, MapPin, Map, CheckCircle2 } from 'lucide-react';
import { meta, nav } from './content';
import { useHashRoute, navigate } from './useHashRoute';
import { Home, Schedule, DayRoute, Guide, Survey } from './pages';

const icons = { home: HomeIcon, schedule: CalendarDays, day1: MapPin, day2: Map, survey: CheckCircle2 };

function Screen({ page, param }) {
  switch (page) {
    case 'schedule':
      return <Schedule />;
    case 'day1':
    case 'day2':
      return <DayRoute id={page} />;
    case 'guide':
      return <Guide id={param} />;
    case 'survey':
      return <Survey />;
    default:
      return <Home />;
  }
}

export default function TrainingSite() {
  const { page, param } = useHashRoute();
  // 해설 화면은 첫 날 메뉴를 켜 둡니다.
  const active = page === 'guide' ? 'day1' : page;

  return (
    <div className="min-h-dvh bg-stone-200 text-stone-900">
      <div className="mx-auto max-w-md min-h-dvh bg-[#f3ead8] shadow-xl flex flex-col">
        <header className="px-4 pt-4 pb-2 text-center">
          <p className="text-xs font-semibold text-stone-500 tracking-widest">{meta.org}</p>
          {page !== 'home' && (
            <p className="text-sm font-bold text-stone-700 truncate">
              {meta.year} {meta.title}
            </p>
          )}
        </header>

        <main className="flex-1 px-4 pb-28 pt-2">
          <Screen page={page} param={param} />
        </main>

        <nav
          aria-label="주요 메뉴"
          className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-white/95 backdrop-blur border-t-2 border-stone-300 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
        >
          <ul className="grid grid-cols-5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {nav.map((n) => {
              const Icon = icons[n.id];
              const on = active === n.id;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => navigate(n.id)}
                    aria-current={on ? 'page' : undefined}
                    className="w-full flex flex-col items-center gap-1 py-1 text-[12px] font-bold"
                  >
                    <span
                      className={`grid place-items-center w-11 h-11 rounded-full shadow transition ${
                        on ? 'bg-orange-500 text-white' : 'bg-orange-200 text-orange-900'
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className={on ? 'text-orange-700' : 'text-stone-700'}>{n.label}</span>
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
