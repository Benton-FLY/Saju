import { FamilyArt } from '../components/FamilyArt';
import { Arrow } from '../components/Icons';
import { serviceCopy as copy } from '../data/serviceCopy';
export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="page-enter landing report-landing">
      <section className="landing-hero">
        <div className="eyebrow">
          <span />
          {copy.hero.eyebrow}
          <span />
        </div>
        <h1 className="preserve-lines">{copy.hero.title}</h1>
        <p className="hero-sub preserve-lines">{copy.hero.description}</p>
        <div className="art-wrap">
          <span className="speech speech-parent">{copy.hero.parentBubble}</span>
          <FamilyArt />
          <span className="speech speech-child">{copy.hero.childBubble}</span>
        </div>
        <p className="landing-promise preserve-lines">{copy.hero.promise}</p>
        <button className="primary hero-cta" onClick={onStart}>
          {copy.hero.cta}
          <Arrow />
        </button>
        <p className="cta-meta">약 1분 · 회원가입 없이 무료</p>
        <p className="landing-footnote">{copy.hero.footnote}</p>
      </section>
      <section className="preview-section">
        <div className="section-eyebrow">{copy.preview.eyebrow}</div>
        <h2 className="preserve-lines">{copy.preview.title}</h2>
        {copy.preview.items.map((item) => (
          <div className="preview-row" key={item.title}>
            <span className="preview-icon">{item.symbol}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Arrow />
          </div>
        ))}
        <p className="privacy-note preserve-lines">{copy.privacy}</p>
      </section>
    </div>
  );
}
