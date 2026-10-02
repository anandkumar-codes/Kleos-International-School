import { useMemo, useState } from 'react';
import { GraduationCap, Briefcase, Users } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, SectionHead } from '../../components/public/Sections';
import { SearchInput, EmptyState, Badge } from '../../components/ui';
import { DEPARTMENTS } from '../../data/records';
import { IMG } from '../../data/school';
import { initials } from '../../utils/format';

const DEPT_COLOR = { 'Pre-Primary': '#d98a10', English: '#2d7dd2', Mathematics: '#10624a', Science: '#7f56c8', 'Social Science': '#9d4e8a', Languages: '#c8323c', 'Computer Science': '#0e7490', Commerce: '#4d7c0f', 'Physical Education': '#177a5b', 'Arts & Music': '#b4531a' };

export default function Faculty() {
  const { state } = useStore();
  const [dept, setDept] = useState('All');
  const [q, setQ] = useState('');
  const faculty = state.teachers.filter((t) => t.showOnWebsite);
  const counts = useMemo(() => Object.fromEntries(DEPARTMENTS.map((d) => [d, faculty.filter((t) => t.department === d).length])), [faculty]);
  const list = faculty.filter((t) => (dept === 'All' || t.department === dept) && (!q || `${t.name} ${t.designation} ${t.department}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <PageHero crumbs={[{ label: 'Campus Life' }, { label: 'Faculty' }]} title="Teachers who <em>know every child</em>" text={`${state.teachers.length} qualified educators with an average of 11 years of classroom experience — and a shared belief that every child can excel.`} image={IMG.teacher} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Faculty directory" title="Meet our <em>educators</em>" action={<SearchInput value={q} onChange={setQ} placeholder="Search by name or subject" style={{ minWidth: 280 }} />} />
          <div className="chip-row" style={{ marginBottom: 28 }}>
            <button className={`chip ${dept === 'All' ? 'is-active' : ''}`} onClick={() => setDept('All')}>All <span className="count">{faculty.length}</span></button>
            {DEPARTMENTS.filter((d) => counts[d]).map((d) => (
              <button key={d} className={`chip ${dept === d ? 'is-active' : ''}`} onClick={() => setDept(d)}>{d} <span className="count">{counts[d]}</span></button>
            ))}
          </div>
          {list.length ? (
            <div className="people-grid">
              {list.map((t, i) => (
                <article key={t.id} className="person" style={{ '--pc': DEPT_COLOR[t.department], animationDelay: `${(i % 8) * 40}ms` }}>
                  <div className="person__photo">
                    <Badge tone="gray" plain>{t.department}</Badge>
                    <span>{initials(t.name)}</span>
                  </div>
                  <div className="person__body">
                    <h4>{t.name}</h4>
                    <div className="person__role">{t.designation}</div>
                    <div className="person__meta">
                      <span><GraduationCap />{t.qualification}</span>
                      <span><Briefcase />{t.experience} years of experience</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title="No faculty match your filters" text="Try another department or clear your search." action={<button className="btn btn--outline btn--sm" onClick={() => { setDept('All'); setQ(''); }}>Clear filters</button>} />
          )}
        </div>
      </section>
    </>
  );
}
