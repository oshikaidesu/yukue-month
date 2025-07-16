import React, { useEffect, useState } from 'react';

const PickupBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // スクロール量に応じて左右に動かす（倍率は調整可）
  const leftX = 0 - scrollY * 0.1; // 左端からさらに左へ
  const rightX = 0 + scrollY * 0.1; // 右端からさらに右へ

  // 背景テキストのパターンを配列で管理（textプロパティ追加）
  const patterns = [
    {
      className: '-left-[20vw] top-0 -translate-y-1/2 text-[7vw] text-gray-100',
      style: { transform: `rotate(-90deg) translateY(0%) translateX(${leftX}%)`, zIndex: 0 },
      text: 'PICKUP PLAYLIST',
    },
    {
      className: 'left-[10vw] top-full -translate-x-full text-[8vw] text-gray-100 opacity-20',
      style: { transform: `rotate(-90deg) translateY(0%) translateX(${leftX * 0.8}%)`, zIndex: 0 },
      text: 'OukueRecords',
    },
    {
      className: '-left-[15vw] bottom-0 translate-y-1/2 text-[6vw] text-[#CCCCCC] opacity-10',
      style: { transform: `rotate(-90deg) translateY(0%) translateX(${leftX * 0.5}%)`, zIndex: 0 },
      text: 'PICKUP PLAYLIST',
    },
    {
      className: 'right-[110vw] top-0 -translate-y-1/2 text-[7vw] text-[#12DA99] opacity-30',
      style: { transform: `rotate(-90deg) scaleX(-1) scaleY(-1) translateY(0%) translateX(${rightX}%)`, zIndex: 0 },
      text: 'yukueRecords',
    },
    {
      className: 'right-[120vw] top-full -translate-y-full text-[9vw] text-[#CCCCCC] opacity-20',
      style: { transform: `rotate(-90deg) scaleX(-1) scaleY(-1) translateY(0%) translateX(${rightX * 0.7}%)`, zIndex: 0 },
      text: 'PICKUP PLAYLIST',
    },
    {
      className: 'right-[115vw] bottom-0 translate-y-1/2 text-[10vw] text-[#12DA99] opacity-10',
      style: { transform: `rotate(-90deg) scaleX(-1) scaleY(-1) translateY(0%) translateX(${rightX * 0.4}%)`, zIndex: 0 },
      text: 'yukueRecords',
    },
    {
      className: '-left-[22vw] bottom-full translate-y-full text-[6vw] text-[#12DA99]',
      style: { transform: `rotate(-90deg) translateY(0%) translateX(${leftX * 0.3}%)`, zIndex: 0 },
      text: 'PICKUP PLAYLIST',
    },
    {
      className: 'right-[125vw] bottom-full translate-y-full text-[8vw] text-[#CCCCCC] opacity-20',
      style: { transform: `rotate(-90deg) scaleX(-1) scaleY(-1) translateY(0%) translateX(${rightX * 0.2}%)`, zIndex: 0 },
      text: 'yukueRecords',
    },
  ];

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      {patterns.map((p, i) => (
        <span
          key={i}
          className={`select-none pointer-events-none absolute font-bold whitespace-nowrap ${p.className}`}
          style={p.style}
          aria-hidden="true"
        >
          {p.text}
        </span>
      ))}
    </div>
  );
};

export default PickupBackground; 