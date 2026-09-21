'use client';

import { useEffect, useRef } from 'react';

/**
 * ConduitBackground — animated flowing pipes/channels/circuits
 * Creates the "data flowing through conduits" aesthetic
 */
export function ConduitBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#0d0d1a] to-[#0a0f1a]" />
      
      {/* Animated SVG pipes */}
      <ConduitPipes />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}

/**
 * SVG animated pipe network — flowing dashed lines that look like data channels
 */
function ConduitPipes() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate dash offset for flowing effect
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('.conduit-path');
    let frame: number;
    let offset = 0;

    const animate = () => {
      offset -= 0.5;
      paths.forEach((path, i) => {
        const speed = (i % 3 === 0) ? 1.5 : (i % 3 === 1) ? 1 : 0.7;
        (path as SVGPathElement).style.strokeDashoffset = `${offset * speed}`;
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Gradient for pipes */}
        <linearGradient id="pipeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </linearGradient>
        
        <linearGradient id="pipeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
          <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="pipeGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal pipes */}
      <path
        className="conduit-path"
        d="M -50 150 Q 200 150 300 200 T 600 180 T 900 220 T 1250 200"
        fill="none"
        stroke="url(#pipeGrad1)"
        strokeWidth="2"
        strokeDasharray="8 12"
        filter="url(#glow)"
      />
      <path
        className="conduit-path"
        d="M -50 350 Q 150 320 350 380 T 700 340 T 1000 370 T 1250 350"
        fill="none"
        stroke="url(#pipeGrad2)"
        strokeWidth="1.5"
        strokeDasharray="6 14"
        filter="url(#glow)"
      />
      <path
        className="conduit-path"
        d="M -50 550 Q 250 520 400 580 T 750 540 T 1100 570 T 1250 550"
        fill="none"
        stroke="url(#pipeGrad1)"
        strokeWidth="1"
        strokeDasharray="4 16"
        filter="url(#glow)"
      />

      {/* Vertical pipes */}
      <path
        className="conduit-path"
        d="M 200 -50 Q 200 100 250 200 T 220 400 T 260 600 T 230 850"
        fill="none"
        stroke="url(#pipeGrad3)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        filter="url(#glow)"
      />
      <path
        className="conduit-path"
        d="M 600 -50 Q 620 150 580 250 T 610 450 T 590 650 T 620 850"
        fill="none"
        stroke="url(#pipeGrad2)"
        strokeWidth="2"
        strokeDasharray="8 12"
        filter="url(#glow)"
      />
      <path
        className="conduit-path"
        d="M 1000 -50 Q 980 120 1020 280 T 990 480 T 1010 680 T 980 850"
        fill="none"
        stroke="url(#pipeGrad1)"
        strokeWidth="1"
        strokeDasharray="4 14"
        filter="url(#glow)"
      />

      {/* Diagonal pipes */}
      <path
        className="conduit-path"
        d="M -50 800 Q 200 600 400 500 T 800 300 T 1250 50"
        fill="none"
        stroke="url(#pipeGrad3)"
        strokeWidth="1"
        strokeDasharray="4 12"
        filter="url(#glow)"
      />
      <path
        className="conduit-path"
        d="M 1250 800 Q 900 650 700 550 T 300 350 T -50 200"
        fill="none"
        stroke="url(#pipeGrad1)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        filter="url(#glow)"
      />

      {/* Junction nodes */}
      {[
        { cx: 300, cy: 200 },
        { cx: 600, cy: 180 },
        { cx: 900, cy: 220 },
        { cx: 200, cy: 400 },
        { cx: 600, cy: 340 },
        { cx: 1000, cy: 370 },
        { cx: 400, cy: 580 },
        { cx: 750, cy: 540 },
        { cx: 250, cy: 250 },
        { cx: 700, cy: 450 },
      ].map((node, i) => (
        <g key={i}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="4"
            fill={i % 2 === 0 ? '#8B5CF6' : '#06B6D4'}
            opacity="0.6"
          />
          <circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="none"
            stroke={i % 2 === 0 ? '#8B5CF6' : '#06B6D4'}
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="6;12;6"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.1;0.4"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/**
 * Floating particles that move along the conduit paths
 */
function FloatingParticles() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${(i * 5.3) % 100}%`,
            top: `${(i * 7.1) % 100}%`,
            backgroundColor: i % 3 === 0 ? '#8B5CF6' : i % 3 === 1 ? '#06B6D4' : '#10B981',
            opacity: 0.3 + (i % 4) * 0.1,
            animation: `float-${i % 4} ${8 + (i % 5) * 2}s linear infinite`,
            animationDelay: `${(i * 0.7) % 4}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float-0 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translate(100px, -200px) scale(0.5); opacity: 0; }
        }
        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translate(-80px, -180px) scale(0.3); opacity: 0; }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate(120px, -160px) scale(0.4); opacity: 0; }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translate(-60px, -220px) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Animated data flow line — used in cards/sections
 */
export function DataFlowLine({ 
  direction = 'horizontal',
  color = '#8B5CF6',
  className = '' 
}: { 
  direction?: 'horizontal' | 'vertical';
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        className={direction === 'horizontal' ? 'w-full h-1' : 'h-full w-1 rotate-90'}
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
      >
        <line
          x1="0" y1="2" x2="100" y2="2"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="8 4"
          className="animate-flow"
        />
      </svg>
      <style jsx>{`
        .animate-flow {
          animation: flowDash 2s linear infinite;
        }
        @keyframes flowDash {
          to { stroke-dashoffset: -12; }
        }
      `}</style>
    </div>
  );
}

/**
 * Circuit board pattern background
 */
export function CircuitPattern({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Horizontal traces */}
          <line x1="0" y1="25" x2="40" y2="25" stroke="#8B5CF6" strokeWidth="0.5" />
          <line x1="60" y1="25" x2="100" y2="25" stroke="#06B6D4" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="35" y2="75" stroke="#06B6D4" strokeWidth="0.5" />
          <line x1="65" y1="75" x2="100" y2="75" stroke="#8B5CF6" strokeWidth="0.5" />
          
          {/* Vertical traces */}
          <line x1="25" y1="0" x2="25" y2="40" stroke="#8B5CF6" strokeWidth="0.5" />
          <line x1="25" y1="60" x2="25" y2="100" stroke="#06B6D4" strokeWidth="0.5" />
          <line x1="75" y1="0" x2="75" y2="35" stroke="#06B6D4" strokeWidth="0.5" />
          <line x1="75" y1="65" x2="75" y2="100" stroke="#8B5CF6" strokeWidth="0.5" />
          
          {/* Junction dots */}
          <circle cx="25" cy="25" r="2" fill="#8B5CF6" />
          <circle cx="75" cy="25" r="2" fill="#06B6D4" />
          <circle cx="25" cy="75" r="2" fill="#06B6D4" />
          <circle cx="75" cy="75" r="2" fill="#8B5CF6" />
          
          {/* Corner turns */}
          <path d="M 40 25 L 50 25 L 50 75 L 65 75" fill="none" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.5" />
          <path d="M 35 75 L 50 75 L 50 25 L 60 25" fill="none" stroke="#06B6D4" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

/**
 * Glowing conduit border — for cards and sections
 */
export function ConduitBorder({ 
  children, 
  className = '',
  glowColor = '#8B5CF6'
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated border */}
      <div 
        className="absolute -inset-px rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          backgroundSize: '200% 100%',
          animation: 'borderFlow 3s linear infinite',
        }}
      />
      
      {/* Content */}
      <div className="relative bg-[#0a0a12] rounded-xl border border-white/5">
        {children}
      </div>
      
      <style jsx>{`
        @keyframes borderFlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
