import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from './Icons';

const links = [
  { to: '/', label: '首页' },
  { to: '/bank', label: '题库' },
  { to: '/drill', label: '单项测试' },
  { to: '/history', label: '成绩记录' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            沪
          </span>
          <span className="brand-text">
            <strong>沪考英语</strong>
            <small>SHANGHAI ENGLISH · MOCK</small>
          </span>
        </Link>
        <nav className={`nav ${open ? 'nav-open' : ''}`} aria-label="主导航">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/" className="nav-cta" onClick={() => setOpen(false)}>
            开始模考
          </Link>
        </nav>
        <button
          type="button"
          className="menu-button"
          aria-label="打开菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">沪考英语 · 模拟场</p>
          <p className="footer-note">
            面向上海高考英语的自主练习工具。题库与评分均为练习用途，不代表官方考试。
          </p>
        </div>
        <div className="footer-meta">
          <span>全部数据保存在本机浏览器</span>
          <span>自动评分仅供参考</span>
        </div>
      </div>
    </footer>
  );
}
