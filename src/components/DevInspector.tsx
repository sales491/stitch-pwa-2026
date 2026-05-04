'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __ag_selected__?: {
      tag: string;
      id: string | null;
      classes: string | null;
      text: string;
      html: string;
    } | null;
  }
}

export default function DevInspector() {
  useEffect(() => {
    // Clean up any previous instance
    ['__ag_hl__', '__ag_badge__'].forEach(id => {
      document.getElementById(id)?.remove();
    });
    window.__ag_selected__ = null;

    // Highlight overlay
    const hl = document.createElement('div');
    hl.id = '__ag_hl__';
    hl.style.cssText =
      'position:fixed;pointer-events:none;z-index:99998;outline:2px solid #3b82f6;background:rgba(59,130,246,0.08);border-radius:3px;display:none';
    document.body.appendChild(hl);

    // Toggle badge
    const badge = document.createElement('div');
    badge.id = '__ag_badge__';
    badge.style.cssText =
      'position:fixed;bottom:12px;right:12px;z-index:99999;font:11px monospace;padding:4px 8px;border-radius:6px;cursor:pointer;user-select:none;background:#374151;color:#9ca3af;border:1px solid #4b5563;transition:all 0.15s';
    badge.textContent = '🔍 OFF';
    document.body.appendChild(badge);

    let active = false;
    let locked = false;

    function setActive(on: boolean) {
      active = on;
      locked = false;
      window.__ag_selected__ = null;
      hl.style.display = 'none';
      if (on) {
        badge.style.background = '#14532d';
        badge.style.color = '#4ade80';
        badge.style.borderColor = '#16a34a';
        badge.textContent = '🔍 ON';
      } else {
        badge.style.background = '#374151';
        badge.style.color = '#9ca3af';
        badge.style.borderColor = '#4b5563';
        badge.textContent = '🔍 OFF';
      }
    }

    const onBadgeClick = () => setActive(!active);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && !(e.target as HTMLElement).matches('input,textarea')) {
        setActive(!active);
      }
      if (e.key === 'Escape' && active) {
        locked = false;
        window.__ag_selected__ = null;
        hl.style.outline = '2px solid #3b82f6';
        hl.style.background = 'rgba(59,130,246,0.08)';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!active || locked || e.target === badge) return;
      const r = (e.target as HTMLElement).getBoundingClientRect();
      hl.style.cssText = `position:fixed;pointer-events:none;z-index:99998;outline:2px solid #3b82f6;background:rgba(59,130,246,0.08);border-radius:3px;top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px`;
    };

    const onClick = (e: MouseEvent) => {
      if (!active || e.target === badge) return;
      e.preventDefault();
      e.stopPropagation();
      locked = true;
      hl.style.outline = '2px solid #22c55e';
      hl.style.background = 'rgba(34,197,94,0.08)';
      const el = e.target as HTMLElement;
      window.__ag_selected__ = {
        tag: el.tagName,
        id: el.id || null,
        classes: typeof el.className === 'string' ? el.className : null,
        text: (el.innerText || '').slice(0, 100),
        html: el.outerHTML.slice(0, 300),
      };
    };

    badge.addEventListener('click', onBadgeClick);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);

    return () => {
      badge.removeEventListener('click', onBadgeClick);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('click', onClick, true);
      hl.remove();
      badge.remove();
    };
  }, []);

  return null;
}
