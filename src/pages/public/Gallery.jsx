import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, Lightbox, useLightbox } from '../../components/public/Sections';
import { SmartImage, SearchInput, EmptyState } from '../../components/ui';
import { galleryCategories } from '../../data/content';
import { IMG } from '../../data/school';

const RATIOS = ['4/5', '4/3', '1/1', '3/4', '16/11', '1/1'];

export default function Gallery() {
  const { state } = useStore();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const lb = useLightbox();
  const list = state.gallery.filter((g) => (cat === 'All' || g.category === cat) && (!q || `${g.title} ${g.category}`.toLowerCase().includes(q.toLowerCase())));
  const count = (c) => state.gallery.filter((g) => g.category === c).length;

  return (
    <>
      <PageHero crumbs={[{ label: 'Campus Life' }, { label: 'Gallery' }]} title="Life at Kleos, <em>in pictures</em>" text="A glimpse of our classrooms, celebrations, competitions and everyday moments." image={IMG.stage} />
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            <div className="chip-row">
              <button className={`chip ${cat === 'All' ? 'is-active' : ''}`} onClick={() => setCat('All')}>All <span className="count">{state.gallery.length}</span></button>
              {galleryCategories.map((c) => (
                <button key={c} className={`chip ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)}>{c} <span className="count">{count(c)}</span></button>
              ))}
            </div>
            <SearchInput value={q} onChange={setQ} placeholder="Search photos" style={{ minWidth: 240 }} />
          </div>
          {list.length ? (
            <div className="masonry" key={cat + q}>
              {list.map((g, i) => (
                <button key={g.id} className="masonry__item" onClick={() => lb.open(i)} style={{ animationDelay: `${(i % 9) * 45}ms` }}>
                  <SmartImage src={g.image} alt={g.title} ratio={RATIOS[i % RATIOS.length]} />
                  <figcaption><span>{g.category}</span>{g.title}</figcaption>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icon={ImageOff} title="No photos found" text="Try a different category or search term." />
          )}
        </div>
      </section>
      <Lightbox items={list} index={lb.index} onClose={lb.close} onIndex={lb.setIndex} />
    </>
  );
}
