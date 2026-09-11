import type { ReactNode } from 'react';
import { Spark } from './Icons';
import { serviceCopy as copy } from '../data/serviceCopy';
export function Layout({ children, onHome }: { children: ReactNode; onHome: () => void }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={onHome} aria-label={`${copy.name} 홈`}>
          <span className="brand-mark">
            <Spark />
          </span>
          {copy.name}
        </button>
        <span className="header-note">{copy.headerNote}</span>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <span className="footer-brand">{copy.name}</span>
        <p className="preserve-lines">{copy.disclaimer}</p>
        <span className="footer-last">{copy.footer}</span>
      </footer>
    </div>
  );
}
