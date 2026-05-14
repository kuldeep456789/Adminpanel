import React, { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create 10000 dots (100x100)
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 10000; i++) {
      const dot = document.createElement('div');
      dot.className = 'grid-dot';
      fragment.appendChild(dot);
    }
    container.appendChild(fragment);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
      <div 
        ref={containerRef}
        className="background-grid w-[120vw] h-[150vh] -left-[10vw] -top-[10vw]"
      />
      <div className="global-scan-line" />
      
      <style>{`
        .background-grid {
          display: grid;
          grid-template-columns: repeat(100, 1fr);
          grid-template-rows: repeat(100, 1fr);
          gap: 1px;
          animation: float 20s ease-in-out infinite;
          pointer-events: auto;
        }

        .grid-dot {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 3s cubic-bezier(0.22, 1, 0.36, 1), 
                      background-color 2s ease, 
                      box-shadow 3s ease;
        }

        .grid-dot::after {
          content: '';
          width: 1.5px;
          height: 1.5px;
          background-color: var(--grid-dot);
          border-radius: 50%;
          transition: inherit;
        }

        .grid-dot:hover {
          transform: scale(8);
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), 
                      background-color 0.3s ease, 
                      box-shadow 0.4s ease;
        }

        .grid-dot:hover::after {
          background-color: var(--grid-hover);
          box-shadow: 0 0 20px 6px var(--grid-glow);
        }

        @keyframes global-scan {
          from { top: -100%; }
          to { top: 200%; }
        }

        .global-scan-line {
          position: fixed;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, transparent, var(--color-accent), transparent);
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
          animation: global-scan 10s linear infinite;
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(2%, 2%) rotate(0.5deg); }
          66% { transform: translate(-1%, 3%) rotate(-0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
