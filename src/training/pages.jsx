import { ChevronRight, MapPin, Flag, Phone } from 'lucide-react';
import { meta, home, schedule, days, guides, survey } from './content';
import { navigate } from './useHashRoute';
import { Photo, Polaroid, PageTitle, Card, BackButton, LinkButton } from './ui';

// ── 첫 화면 ─────────────────────────────────────────────
export function Home() {
  const photos = home.photos;
  const tilt = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6', '-rotate-3', 'rotate-2'];
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-sky-100/80 rounded-lg px-5 py-4 mt-2">
        <p className="text-base font-semibold text-stone-700">
          {meta.year} {meta.audience}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">{meta.title}</h1>
      </div>
      <p className="mt-4 font-bold text-stone-700 tracking-wide">{meta.org}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 w-full">
        {photos.map((p, i) => (
          <Polaroid key={i} src={p} alt="" className={tilt[i % tilt.length]} />
        ))}
      </div>

      <p className="mt-8 text-stone-600 text-sm leading-relaxed">
        {meta.place} 현장연수 안내 페이지입니다.
        <br />
        아래 메뉴에서 일정과 코스를 확인하세요.
      </p>
    </div>
  );
}

// ── 연수 일정 ────────────────────────────────────────────
function Lines({ value }) {
  const lines = Array.isArray(value) ? value : [value];
  return lines.map((l, i) => (
    <span key={i} className={i === 0 ? 'block' : 'block text-stone-600 text-[13px]'}>
      {l}
    </span>
  ));
}

export function Schedule() {
  return (
    <>
      <PageTitle icon="🗓️">{schedule.title}</PageTitle>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-sky-100 text-stone-800">
            <tr>
              <th className="py-2 px-2 text-left w-[6.5rem]">시간</th>
              <th className="py-2 px-1 w-10">분</th>
              <th className="py-2 px-2 text-left">내용</th>
              <th className="py-2 px-2 text-left w-24 hidden sm:table-cell">장소</th>
            </tr>
          </thead>
          {schedule.days.map((day) => (
            <tbody key={day.label}>
              <tr className="bg-amber-50 border-t-2 border-stone-300">
                <th colSpan={4} className="py-2 px-3 text-left font-bold text-amber-900">
                  {day.label}
                </th>
              </tr>
              {day.rows.map((r, i) => (
                <tr key={i} className="border-t border-stone-200 align-top">
                  <td className="py-1.5 px-2 whitespace-nowrap text-stone-700">{r[0]}</td>
                  <td className="py-1.5 px-1 text-center text-stone-500">{r[1]}</td>
                  <td className="py-1.5 px-2 text-stone-800">
                    <Lines value={r[2]} />
                    {r[3] && <span className="sm:hidden block text-[12px] text-amber-800">📍 {r[3]}</span>}
                  </td>
                  <td className="py-1.5 px-2 text-stone-600 text-[13px] hidden sm:table-cell">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        <p className="px-4 py-3 text-xs text-stone-500">{schedule.note}</p>
      </Card>
      <p className="mt-4 flex items-center justify-center gap-2 text-amber-900 font-semibold">
        <Phone size={16} /> 담당자: {meta.contact.role} {meta.contact.name}
        <a href={`tel:${meta.contact.phone}`} className="underline">
          ({meta.contact.phone})
        </a>
      </p>
    </>
  );
}

// ── 날짜별 코스 ──────────────────────────────────────────
function go(stop) {
  if (stop.type === 'guide') navigate('guide', stop.target);
  else if (stop.type === 'page') navigate(stop.target);
}

const badge = ['bg-orange-400', 'bg-green-500', 'bg-sky-500', 'bg-pink-400'];

export function DayRoute({ id }) {
  const day = days[id];
  return (
    <>
      <PageTitle icon="🗺️">{day.title}</PageTitle>
      <Card>
        <p className="inline-flex items-center gap-2 bg-yellow-200 rounded px-3 py-1 font-bold text-stone-800">
          <MapPin size={18} className="text-red-500" /> {day.start}
        </p>
        <ol className="mt-5 relative border-l-4 border-dashed border-stone-400 ml-4 space-y-5">
          {day.stops.map((s, i) => {
            const inner = (
              <>
                <div className="w-20 h-16 shrink-0 overflow-hidden rounded-md">
                  <Photo src={s.photo} alt="" />
                </div>
                <span className="flex-1 font-bold text-stone-800 text-lg">{s.label}</span>
                <ChevronRight className="text-stone-400" />
              </>
            );
            const cls =
              'flex items-center gap-3 w-full bg-amber-50 hover:bg-amber-100 rounded-xl p-2 pr-3 border border-amber-200 shadow-sm active:scale-[0.98] transition text-left';
            return (
              <li key={s.n} className="pl-6 relative">
                <span
                  className={`absolute -left-[14px] top-4 w-6 h-6 rounded-full text-white text-sm font-bold grid place-items-center ${badge[i % 4]}`}
                >
                  {s.n}
                </span>
                {s.type === 'link' ? (
                  <a href={s.target} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={() => go(s)} className={cls}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        {id === 'day2' && (
          <p className="mt-5 inline-flex items-center gap-2 bg-pink-100 rounded px-3 py-1 font-bold text-stone-800">
            <Flag size={18} className="text-pink-500" /> 정리 및 귀가
          </p>
        )}
      </Card>
    </>
  );
}

// ── 해설 화면 ────────────────────────────────────────────
function Bullet({ item }) {
  if (typeof item === 'string') return <li>{item}</li>;
  return (
    <li>
      {item.text}
      <ul className="list-[circle] pl-5 mt-1 space-y-1">
        {item.items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </li>
  );
}

export function Guide({ id }) {
  const g = guides[id];
  if (!g) {
    return (
      <Card>
        <p>해당 화면이 없습니다.</p>
        <BackButton />
      </Card>
    );
  }
  const backTo = g.parent ? { to: 'guide', param: g.parent, label: guides[g.parent].title } : { to: 'day1' };
  return (
    <>
      <PageTitle icon="📕">{g.title}</PageTitle>
      <Card>
        <h3 className="text-lg font-extrabold text-amber-700 bg-yellow-100 inline-block px-1 mb-3">한 눈에 보기</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-stone-800">
          {g.summary.map((s, i) => (
            <Bullet key={i} item={s} />
          ))}
        </ul>

        {g.quotes?.length > 0 && (
          <div className="my-6 text-center text-amber-800 font-semibold leading-loose">
            {g.quotes.map((q, i) => (
              <p key={i}>{q}</p>
            ))}
          </div>
        )}

        {g.photos?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {g.photos.map((p, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg">
                <Photo src={p} alt="" />
              </div>
            ))}
          </div>
        )}

        {g.links?.length > 0 && (
          <div className="mt-5 flex flex-col gap-2">
            {g.links.map((l) => (
              <LinkButton key={l.url} href={l.url} className="text-base py-2">
                {l.label}
              </LinkButton>
            ))}
          </div>
        )}

        {g.children?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-stone-500 mb-2">더 보기</p>
            <div className="flex flex-col gap-2">
              {g.children.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => navigate('guide', c)}
                  className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 font-bold text-stone-800 active:scale-[0.98] transition"
                >
                  {guides[c].title} <ChevronRight className="text-stone-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-right">
          <BackButton {...backTo} />
        </div>
      </Card>
    </>
  );
}

// ── 만족도 조사 ──────────────────────────────────────────
export function Survey() {
  return (
    <>
      <PageTitle icon="😊">{survey.title}</PageTitle>
      <Card className="text-center">
        <div className="space-y-2 text-[17px] leading-relaxed text-stone-800">
          {survey.message.map((m, i) => (
            <p key={i} className={i === 0 ? 'font-bold' : ''}>
              {m}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <LinkButton href={survey.url}>{survey.buttonLabel}</LinkButton>
        </div>
        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-lg">
          <Photo src={survey.photo} alt="" />
        </div>
      </Card>
    </>
  );
}
