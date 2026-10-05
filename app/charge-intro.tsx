"use client";

import { useEffect, useState } from "react";

export function chargePercent(elapsed: number) {
  return Math.min(100, Math.max(1, Math.floor(1 + (elapsed / 2400) * 99)));
}

export default function ChargeIntro() {
  const [percent, setPercent] = useState(1);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const main = document.querySelector("main");
    const previousInert = main?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    if (main) main.inert = true;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;
    let hold: ReturnType<typeof setTimeout>;
    let finish: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const next = reduced ? 100 : chargePercent(now - started);
      setPercent(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else {
        hold = setTimeout(() => {
          setClosing(true);
          finish = setTimeout(() => setVisible(false), reduced ? 0 : 320);
        }, reduced ? 0 : 300);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hold);
      clearTimeout(finish);
      if (main) main.inert = previousInert;
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;
  const circumference = 2 * Math.PI * 118;
  return (
    <div className={`charge-intro ${closing ? "charge-closing" : ""}`} role="dialog" aria-modal="true" aria-label="アプリの起動アニメーション">
      <div className={`reactor-unit ${percent === 100 ? "reactor-charged" : ""}`}>
        <p className="reactor-kicker">SHIFT SYSTEM</p>
        <div className="reactor-display" role="progressbar" aria-label="起動演出" aria-valuemin={1} aria-valuemax={100} aria-valuenow={percent}>
          <svg viewBox="0 0 320 320" className="reactor-rings" aria-hidden="true">
            <circle cx="160" cy="160" r="151" className="reactor-outline" />
            <g className="reactor-spin"><circle cx="160" cy="160" r="142" className="reactor-segments" /></g>
            <circle cx="160" cy="160" r="128" className="reactor-track" />
            <circle cx="160" cy="160" r="118" className="reactor-track" />
            <circle cx="160" cy="160" r="118" className="reactor-charge" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} transform="rotate(-90 160 160)" />
            <g className="reactor-spin-reverse"><circle cx="160" cy="160" r="102" className="reactor-inner-segments" /></g>
            <circle cx="160" cy="160" r="85" className="reactor-core-ring" />
          </svg>
          <div className="reactor-core"><strong>{percent}<span>%</span></strong><span className="reactor-core-caption">{percent === 100 ? "READY" : "CHARGING"}</span></div>
        </div>
        <div className="reactor-caption" aria-live="polite">{percent === 100 ? "起動完了" : "アプリを起動しています"}</div>
        <div className="reactor-linear-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
        <p className="reactor-footnote">アルバイト</p>
      </div>
    </div>
  );
}
