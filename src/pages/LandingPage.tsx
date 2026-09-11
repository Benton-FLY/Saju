import { FamilyArt } from '../components/FamilyArt';
import { Arrow, Spark } from '../components/Icons';
export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="page-enter landing">
      <section className="landing-hero">
        <div className="eyebrow">
          <span /> 태어날 때부터 이어진, 우리 <span />
        </div>
        <h1>
          우리 아이와 나는
          <br />
          원래부터 <span className="heading-emphasis">잘 맞는</span>
          <br />
          사이일까?
        </h1>
        <p className="hero-sub">
          생년월일시로 알아보는
          <br />
          부모와 아이의 타고난 케미
        </p>
        <div className="art-wrap">
          <span className="art-caption">
            다른 두 기운이 만나
            <br />
            하나의 우리가 되는 일
          </span>
          <FamilyArt />
          <span className="seal">
            천생
            <br />
            인연
          </span>
        </div>
        <div className="hero-bottom">
          <span className="small-star">✳</span>
          <p>
            닮아서 반갑고, 달라서 특별한 우리.
            <br />
            <strong>사주로 읽는 둘만의 이야기를 만나보세요.</strong>
          </p>
        </div>
        <button className="primary hero-cta" onClick={onStart}>
          우리 궁합 보기 <Arrow />
        </button>
        <div className="cta-meta">
          <span>약 1분 소요</span>
          <i /> <span>회원가입 없이 무료로</span>
        </div>
      </section>
      <section className="preview-section">
        <div className="section-eyebrow">우리 사이에 숨겨진 이야기</div>
        <h2>
          얼마나 잘 맞을까, 보다
          <br />
          <em>어떻게 더 잘 지낼까.</em>
        </h2>
        <div className="preview-row">
          <span className="preview-icon">合</span>
          <div>
            <h3>우리만의 관계 이름</h3>
            <p>찰떡 한 팀일까, 티격태격 성장형일까?</p>
          </div>
          <Arrow />
        </div>
        <div className="preview-row">
          <span className="preview-icon">
            <Spark />
          </span>
          <div>
            <h3>다섯 가지 타고난 케미</h3>
            <p>성격부터 대화, 함께 자라는 힘까지</p>
          </div>
          <Arrow />
        </div>
        <div className="preview-row">
          <span className="preview-icon">心</span>
          <div>
            <h3>마음을 잇는 작은 힌트</h3>
            <p>오늘 바로 건넬 수 있는 다정한 한마디</p>
          </div>
          <Arrow />
        </div>
        <p className="privacy-note">
          ⌑ 생년월일시는 저장하지 않아요.
          <br />
          입력한 정보는 이 브라우저에서만 계산해요.
        </p>
      </section>
    </div>
  );
}
