import type { ReactNode } from 'react';
import { Spark } from './Icons';
export function Layout({ children, onHome }: { children: ReactNode; onHome: () => void }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={onHome} aria-label="타고난 우리 사이 홈">
          <span className="brand-mark">
            <Spark />
          </span>
          타고난 우리 사이
        </button>
        <span className="header-note">부모와 아이의 인연록</span>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <span className="footer-brand">타고난 우리 사이</span>
        <p>
          본 서비스의 사주·궁합 결과는 재미와 참고를 위한 콘텐츠이며,
          <br />
          부모와 자녀의 실제 관계를 판단하는 기준이 아닙니다.
        </p>
        <span className="footer-last">서로를 이해하는, 조금 더 다정한 시작.</span>
      </footer>
    </div>
  );
}
