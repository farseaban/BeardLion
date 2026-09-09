import { ChevronRight, MapPin, Flag, Phone, FileText, ExternalLink, Coffee, ClipboardCheck } from 'lucide-react';
import { meta, home, schedule, course, guides, materials, participate } from './content';
import { navigate } from './useHashRoute';
import { Photo, Polaroid, PageTitle, Card, BackButton, LinkButton } from './ui';

// ── 첫 화면 ─────────────────────────────────────────────
export function Home() {
  const tilt = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6'];
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-sky-100/80 rounded-lg px-5 py-4 mt-2">
        <p className="text-base font-semibold text-stone-700">
          {meta.year} {meta.audience}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">{meta.title}</h1>
      </div>
      <p className="mt-4 font-bold text-stone-700 tracking-wide">{meta.org}</p>

      <ul className="mt-4 space-y-1 text-sm text-stone-700">
        {meta.summary.map((s, i) => (
          <li key={i} className="bg-white/70 rounded px-3 py-1.5">
            {s}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        {home.photos.map((p, i) => (
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
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-amber-900 font-semibold">
        <Phone size={16} /> {meta.dept} {meta.contact.role} {meta.contact.name}
        <a href={`tel:${meta.contact.phone}`} className="underline">
          {meta.contact.phone}
        </a>
      </p>
    </>
  );
}

// ── 코스 ─────────────────────────────────────────────────
const badge = ['bg-orange-400', 'bg-green-500', 'bg-sky-500', 'bg-pink-400', 'bg-violet-400'];

function go(stop) {
  if (stop.type === 'guide') navigate('guide', stop.target);
  else if (stop.type === 'page') navigate(stop.target);
}

export function Course() {
  return (
    <>
      <PageTitle icon="🗺️">{course.title}</PageTitle>
      <Card>
        <p className="inline-flex items-center gap-2 bg-yellow-200 rounded px-3 py-1 font-bold text-stone-800">
          <MapPin size={18} className="text-red-500" /> {course.start}
        </p>
        <ol className="mt-5 relative border-l-4 border-dashed border-stone-400 ml-4 space-y-5">
          {course.stops.map((s, i) => {
            const inner = (
              <>
                <div className="w-20 h-16 shrink-0 overflow-hidden rounded-md">
                  <Photo src={s.photo} alt="" />
                </div>
                <span className="flex-1 text-left">
                  <span className="block font-bold text-stone-800 text-lg">{s.label}</span>
                  {s.time && <span className="block text-[13px] text-stone-500">{s.time}</span>}
                </span>
                <ChevronRight className="text-stone-400" />
              </>
            );
            const cls =
              'flex items-center gap-3 w-full bg-amber-50 hover:bg-amber-100 rounded-xl p-2 pr-3 border border-amber-200 shadow-sm active:scale-[0.98] transition text-left';
            return (
              <li key={s.n} className="pl-6 relative">
                <span
                  className={`absolute -left-[14px] top-4 w-6 h-6 rounded-full text-white text-sm font-bold grid place-items-center ${badge[i % badge.length]}`}
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
        <p className="mt-5 inline-flex items-center gap-2 bg-pink-100 rounded px-3 py-1 font-bold text-stone-800">
          <Flag size={18} className="text-pink-500" /> {course.end}
        </p>
      </Card>
    </>
  );
}

// ── 장소 소개 ────────────────────────────────────────────
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
        <BackButton to="course" />
      </Card>
    );
  }
  return (
    <>
      <PageTitle icon="📍">{g.title}</PageTitle>
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

        <div className="mt-6 text-right">
          <BackButton to="course" label="코스로" />
        </div>
      </Card>
    </>
  );
}

// ── 연수 자료 ────────────────────────────────────────────
export function Materials() {
  return (
    <>
      <PageTitle icon="📚">{materials.title}</PageTitle>
      <p className="mb-4 text-sm text-stone-600 leading-relaxed">{materials.intro}</p>
      <div className="space-y-4">
        {materials.items.map((m) => (
          <Card key={m.id}>
            <h3 className="flex items-start gap-2 font-bold text-stone-800 text-[17px]">
              <FileText size={20} className="shrink-0 mt-0.5 text-amber-600" />
              {m.label}
            </h3>
            {m.meta && <p className="mt-1 ml-7 text-[13px] text-stone-500">{m.meta}</p>}
            <ul className="mt-3 ml-7 list-disc pl-4 space-y-1 text-[15px] leading-relaxed text-stone-800">
              {m.summary.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            {m.url && (
              <div className="mt-4 ml-7">
                <LinkButton href={m.url} className="text-base py-2">
                  {m.urlLabel || '열기'}
                </LinkButton>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

// ── 참여하기 (음료 신청 · 만족도) ─────────────────────────
export function Participate() {
  const { survey, coffee } = participate;
  return (
    <>
      <PageTitle icon="✅">{participate.title}</PageTitle>

      <Card className="text-center">
        <h3 className="inline-flex items-center gap-2 text-lg font-extrabold text-amber-800">
          <Coffee size={20} /> {coffee.label}
        </h3>
        <p className="mt-1 text-[13px] font-semibold text-red-600">{coffee.when}</p>
        <div className="mt-3 space-y-1 text-[15px] leading-relaxed text-stone-800">
          {coffee.message.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
          {coffee.drinks.map((d) => (
            <li key={d} className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-[13px] text-amber-900">
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <LinkButton href={coffee.url}>{coffee.buttonLabel}</LinkButton>
        </div>

        <div className="mt-6 text-left">
          <p className="text-sm font-semibold text-stone-500 mb-2">호차별 담당 장학사</p>
          <ul className="grid grid-cols-2 gap-2">
            {coffee.buses.map((b) => (
              <li key={b.bus} className="rounded-lg bg-stone-100 px-3 py-2 text-[15px]">
                <span className="font-bold text-stone-800">{b.bus}</span>
                <span className="ml-2 text-stone-600">{b.staff}</span>
              </li>
            ))}
          </ul>
          {coffee.tallyUrl && (
            <a
              href={coffee.tallyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[13px] text-sky-700 underline"
            >
              담당 장학사용 집계표 <ExternalLink size={13} />
            </a>
          )}
        </div>
      </Card>

      <Card className="text-center mt-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-extrabold text-amber-800">
          <ClipboardCheck size={20} /> {survey.label}
        </h3>
        <p className="mt-1 text-[13px] text-stone-500">{survey.when}</p>
        <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-stone-800">
          {survey.message.map((m, i) => (
            <p key={i} className={i === 0 ? 'font-bold' : ''}>
              {m}
            </p>
          ))}
        </div>
        <div className="mt-5">
          <LinkButton href={survey.url}>{survey.buttonLabel}</LinkButton>
        </div>
      </Card>
    </>
  );
}
