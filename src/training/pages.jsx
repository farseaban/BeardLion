import { ChevronRight, ChevronDown, MapPin, Flag, Phone, FileText, ExternalLink, Coffee, ClipboardCheck } from 'lucide-react';
import { meta, home, schedule, course, guides, materials, participate } from './content';
import { Photo, Polaroid, PageTitle, Card, BackButton, LinkButton } from './ui';

// ── 첫 화면 ─────────────────────────────────────────────
export function Home() {
  return (
    <div>
      <div className="text-center">
        <p className="text-[17px] font-bold text-accent">
          {meta.year} {meta.audience}
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-snug text-ink">{meta.title}</h1>
      </div>

      <ul className="mt-6 space-y-3">
        {meta.summary.map((s, i) => (
          <li
            key={i}
            className="bg-card border border-line border-l-[6px] border-l-accent rounded-box px-4 py-3 text-[16px] leading-relaxed text-ink"
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {home.photos.map((p, i) => (
          <Polaroid key={i} src={p} alt="" />
        ))}
      </div>

      <p className="mt-8 text-center text-[16px] leading-relaxed text-muted">
        {meta.place} 현장연수 안내입니다.
        <br />
        아래로 내려가시면 일정·코스·자료·참여가 차례로 나옵니다.
      </p>
    </div>
  );
}

// ── 연수 일정 ────────────────────────────────────────────
function Lines({ value }) {
  const lines = Array.isArray(value) ? value : [value];
  return lines.map((l, i) => (
    <span key={i} className="block">
      {l}
    </span>
  ));
}

export function Schedule() {
  return (
    <>
      <PageTitle>{schedule.title}</PageTitle>

      <div className="space-y-6">
        {schedule.days.map((day) => (
          <section key={day.label} className="border border-line rounded-box overflow-hidden bg-card">
            <h3 className="bg-accent px-4 py-3 text-[17px] font-bold text-onAccent">{day.label}</h3>
            <ul>
              {day.rows.map((r, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[92px_1fr] gap-3 px-4 py-4 border-t border-line first:border-t-0"
                >
                  <div>
                    <p className="text-[15px] font-bold text-accent leading-snug">{r[0]}</p>
                    {r[1] && <p className="text-[14px] text-muted">{r[1]}</p>}
                  </div>
                  <div>
                    <p className="text-[17px] leading-relaxed text-ink">
                      <Lines value={r[2]} />
                    </p>
                    {r[3] && (
                      <p className="mt-1 flex items-start gap-1 text-[15px] text-accent">
                        <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" />
                        {r[3]}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-4 text-[15px] text-muted">{schedule.note}</p>

      <div className="mt-6 border border-line rounded-box bg-card px-4 py-4 text-[16px]">
        <p className="font-bold text-accent">
          {meta.dept} {meta.contact.role} {meta.contact.name}
        </p>
        <a
          href={`tel:${meta.contact.phone}`}
          className="mt-2 inline-flex items-center gap-2 min-h-[48px] text-[18px] font-bold text-accent underline"
        >
          <Phone size={20} aria-hidden="true" /> {meta.contact.phone}
        </a>
      </div>
    </>
  );
}

// ── 코스 ─────────────────────────────────────────────────
// 한 장 스크롤이므로 화면을 옮기지 않고 같은 페이지 안에서 내려갑니다.
function anchorOf(stop) {
  if (stop.type === 'guide') return `#guide-${stop.target}`;
  if (stop.type === 'page') return `#sec-${stop.target}`;
  return stop.target;
}

export function Course() {
  return (
    <>
      <PageTitle>{course.title}</PageTitle>

      <p className="flex items-center gap-2 rounded-box bg-soft border border-line px-4 py-3 text-[16px] font-bold text-onSoft">
        <MapPin size={19} className="shrink-0" aria-hidden="true" /> {course.start}
      </p>

      <ol className="mt-4 space-y-3">
        {course.stops.map((s) => {
          const inner = (
            <>
              <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-accent text-onAccent text-[16px] font-bold">
                {s.n}
              </span>
              <span className="w-20 h-16 shrink-0 overflow-hidden rounded-box border border-line">
                <Photo src={s.photo} alt="" />
              </span>
              <span className="flex-1 text-left">
                <span className="block text-[18px] font-bold text-ink leading-snug">{s.label}</span>
                {s.time && <span className="block text-[15px] text-muted">{s.time}</span>}
              </span>
              {/* 같은 쪽 안에서 아래로 내려가므로 아래쪽 화살표를 씁니다.
                  오른쪽 화살표는 다른 화면으로 넘어간다는 뜻이라 여기서는 어긋납니다.
                  바깥 링크(패들렛·구글폼)만 오른쪽 화살표를 그대로 둡니다. */}
              {s.type === 'link' ? (
                <ChevronRight size={24} className="shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <ChevronDown size={24} className="shrink-0 text-accent" aria-hidden="true" />
              )}
            </>
          );
          const cls =
            'flex items-center gap-3 w-full min-h-[80px] bg-card border border-line rounded-box p-3 text-left';
          return (
            <li key={s.n}>
              <a
                href={anchorOf(s)}
                {...(s.type === 'link' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cls}
              >
                {inner}
              </a>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 flex items-center gap-2 rounded-box bg-soft border border-line px-4 py-3 text-[16px] font-bold text-onSoft">
        <Flag size={19} className="shrink-0" aria-hidden="true" /> {course.end}
      </p>
    </>
  );
}

// ── 장소 소개 ────────────────────────────────────────────
function Bullet({ item }) {
  if (typeof item === 'string') return <li>{item}</li>;
  return (
    <li>
      {item.text}
      <ul className="list-[circle] pl-5 mt-2 space-y-2">
        {item.items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </li>
  );
}

export function Guide({ id, inline = false }) {
  const g = guides[id];
  if (!g) {
    return (
      <Card>
        <p className="text-[17px]">해당 화면이 없습니다.</p>
        <div className="mt-4">
          <BackButton to="course" />
        </div>
      </Card>
    );
  }
  return (
    <>
      <div id={`guide-${id}`} className="scroll-mt-24" />
      <PageTitle>{g.title}</PageTitle>
      <Card>
        <h3 className="text-[18px] font-bold text-accent mb-3">한 눈에 보기</h3>
        <ul className="list-disc pl-5 space-y-2.5 text-[17px] leading-relaxed text-ink">
          {g.summary.map((s, i) => (
            <Bullet key={i} item={s} />
          ))}
        </ul>

        {g.quotes?.length > 0 && (
          <div className="my-6 border-l-4 border-line pl-4 text-[17px] leading-relaxed text-onSoft">
            {g.quotes.map((q, i) => (
              <p key={i}>{q}</p>
            ))}
          </div>
        )}

        {g.photos?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-5">
            {g.photos.map((p, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-box border border-line">
                <Photo src={p} alt="" />
              </div>
            ))}
          </div>
        )}

        {g.links?.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            {g.links.map((l) => (
              <LinkButton key={l.url} href={l.url}>
                {l.label}
              </LinkButton>
            ))}
          </div>
        )}
      </Card>

      {!inline && (
        <div className="mt-5">
          <BackButton to="course" label="코스로 돌아가기" />
        </div>
      )}
    </>
  );
}

// ── 연수 자료 ────────────────────────────────────────────
export function Materials() {
  return (
    <>
      <PageTitle>{materials.title}</PageTitle>
      <p className="mb-5 text-[16px] leading-relaxed text-muted">{materials.intro}</p>
      <div className="space-y-5">
        {materials.items.map((m) => (
          <Card key={m.id}>
            <h3 className="flex items-start gap-2 text-[19px] font-bold leading-snug text-ink">
              <FileText size={22} className="shrink-0 mt-1 text-accent" aria-hidden="true" />
              {m.label}
            </h3>
            {m.meta && <p className="mt-2 text-[15px] text-muted">{m.meta}</p>}
            <ul className="mt-4 list-disc pl-5 space-y-2 text-[17px] leading-relaxed text-ink">
              {m.summary.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            {m.url && (
              <div className="mt-5">
                <LinkButton href={m.url}>{m.urlLabel || '열기'}</LinkButton>
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
      <PageTitle>{participate.title}</PageTitle>

      <Card>
        <h3 className="flex items-center gap-2 text-[20px] font-bold text-onSoft">
          <Coffee size={22} className="shrink-0" aria-hidden="true" /> {coffee.label}
        </h3>
        <p className="mt-2 text-[16px] font-bold text-warn">{coffee.when}</p>
        <div className="mt-3 space-y-2 text-[17px] leading-relaxed text-ink">
          {coffee.message.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-2">
          {coffee.drinks.map((d) => (
            <li
              key={d}
              className="rounded-box bg-soft border border-line px-3 py-2.5 text-[15px] text-ink"
            >
              {d}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <LinkButton href={coffee.url}>{coffee.buttonLabel}</LinkButton>
        </div>

        <div className="mt-7 pt-5 border-t border-line">
          <p className="text-[16px] font-bold text-accent mb-3">호차별 담당 장학사</p>
          <ul className="grid grid-cols-2 gap-2">
            {coffee.buses.map((b) => (
              <li key={b.bus} className="rounded-box bg-soft border border-line px-3 py-2.5 text-[16px]">
                <span className="font-bold text-onSoft">{b.bus}</span>
                <span className="ml-2 text-ink">{b.staff}</span>
              </li>
            ))}
          </ul>
          {coffee.tallyUrl && (
            <a
              href={coffee.tallyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 min-h-[48px] text-[16px] font-bold text-accent underline"
            >
              담당 장학사용 집계표 <ExternalLink size={17} aria-hidden="true" />
            </a>
          )}
        </div>
      </Card>

      <Card className="mt-5">
        <h3 className="flex items-center gap-2 text-[20px] font-bold text-onSoft">
          <ClipboardCheck size={22} className="shrink-0" aria-hidden="true" /> {survey.label}
        </h3>
        <p className="mt-2 text-[16px] text-muted">{survey.when}</p>
        <div className="mt-3 space-y-2 text-[17px] leading-relaxed text-ink">
          {survey.message.map((m, i) => (
            <p key={i} className={i === 0 ? 'font-bold' : ''}>
              {m}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <LinkButton href={survey.url}>{survey.buttonLabel}</LinkButton>
        </div>
      </Card>
    </>
  );
}
