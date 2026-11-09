import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FoodItem } from '../types';
import { soundFx } from '../utils/audio';

interface WheelProps {
  items: FoodItem[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: FoodItem) => void;
}

export const Wheel: React.FC<WheelProps> = ({
  items,
  isSpinning,
  onSpinStart,
  onSpinEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);
  const [needleDeflection, setNeedleDeflection] = useState<number>(0);

  const numSlices = items.length;
  const sliceAngle = (Math.PI * 2) / (numSlices || 1);

  // Draw the wheel onto canvas
  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 24;

    ctx.clearRect(0, 0, width, height);

    if (numSlices === 0) {
      // Empty state
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Vui lòng bật ít nhất 2 món ăn', centerX, centerY);
      ctx.restore();
      return;
    }

    // Outer shadow / glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.restore();

    // Outer Decorative Brass Rim
    ctx.save();
    const rimGrad = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius,
      centerX + radius,
      centerY + radius
    );
    rimGrad.addColorStop(0, '#fef08a'); // gold light
    rimGrad.addColorStop(0.3, '#d97706'); // warm amber
    rimGrad.addColorStop(0.7, '#b45309'); // deep bronze
    rimGrad.addColorStop(1, '#fef08a'); // gold highlight

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Inner rim line
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();
    ctx.restore();

    // Slices rendering
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < numSlices; i++) {
      const item = items[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Slice Path
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternating subtle sector gradient
      const sectorGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      sectorGrad.addColorStop(0, '#ffffff20');
      sectorGrad.addColorStop(0.3, item.color);
      sectorGrad.addColorStop(1, item.color);

      ctx.fillStyle = sectorGrad;
      ctx.fill();

      // Slice edge separator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text in slice
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = item.textColor || '#ffffff';

      // Adaptive font sizing based on slice count
      let fontSize = 14;
      if (numSlices <= 8) fontSize = 16;
      else if (numSlices <= 12) fontSize = 14;
      else if (numSlices <= 16) fontSize = 12.5;
      else fontSize = 11;

      ctx.font = `600 ${fontSize}px "Be Vietnam Pro", sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate name if too long for small slices
      let displayName = item.name;
      const maxTextWidth = radius * 0.62;
      if (ctx.measureText(displayName).width > maxTextWidth) {
        while (displayName.length > 4 && ctx.measureText(displayName + '...').width > maxTextWidth) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }

      ctx.fillText(displayName, radius - 20, 0);

      // Subtle category dot
      ctx.restore();
    }

    // Outer Pin studs around the rim
    for (let i = 0; i < numSlices; i++) {
      const pinAngle = i * sliceAngle;
      const pinX = Math.cos(pinAngle) * (radius + 5.5);
      const pinY = Math.sin(pinAngle) * (radius + 5.5);

      ctx.beginPath();
      ctx.arc(pinX, pinY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#92400e';
      ctx.stroke();
    }

    ctx.restore(); // Exit rotation

    // Central Hub / Center piece
    ctx.save();
    ctx.translate(centerX, centerY);

    // Hub outer shadow
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    // Hub golden ring
    const hubGold = ctx.createLinearGradient(-36, -36, 36, 36);
    hubGold.addColorStop(0, '#fef08a');
    hubGold.addColorStop(0.5, '#d97706');
    hubGold.addColorStop(1, '#78350f');
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fillStyle = hubGold;
    ctx.fill();

    // Hub inner button face
    const innerFace = ctx.createRadialGradient(-5, -5, 2, 0, 0, 28);
    innerFace.addColorStop(0, '#ffffff');
    innerFace.addColorStop(0.7, '#f1f5f9');
    innerFace.addColorStop(1, '#cbd5e1');
    ctx.beginPath();
    ctx.arc(0, 0, 27, 0, Math.PI * 2);
    ctx.fillStyle = innerFace;
    ctx.fill();

    // Small fork & spoon or food icon in center
    ctx.fillStyle = '#c2410c';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍜', 0, -1);

    ctx.restore();
  }, [items, numSlices, sliceAngle]);

  // Handle high-DPI canvas setup & initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = 440;

    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    drawWheel(currentRotationRef.current);
  }, [drawWheel]);

  // Pointer position is at Top (3 * PI / 2 or -PI / 2)
  const POINTER_ANGLE = -Math.PI / 2;

  // Function to spin the wheel
  const startSpin = useCallback(() => {
    if (isSpinning || numSlices < 2) return;

    onSpinStart();
    soundFx.playClick();

    const startRotation = currentRotationRef.current;
    // Spin between 5 and 8 full revolutions + random sector offset
    const randomExtraRevolutions = 5 + Math.random() * 3;
    const randomTargetAngle = Math.random() * Math.PI * 2;
    const totalRotationDelta = randomExtraRevolutions * Math.PI * 2 + randomTargetAngle;
    const finalRotation = startRotation + totalRotationDelta;

    const duration = 5200; // 5.2 seconds for dramatic, smooth deceleration
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease out: 1 - (1 - t)^4 for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startRotation + totalRotationDelta * easeOut;
      currentRotationRef.current = currentAngle;

      drawWheel(currentAngle);

      // Calculate instantaneous needle deflection and trigger tick sound
      // Pin angle relative to pointer
      const normalizedAngle = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const relativeAngle = (POINTER_ANGLE - normalizedAngle + Math.PI * 4) % (Math.PI * 2);
      const currentSliceIndex = Math.floor(relativeAngle / sliceAngle);

      if (currentSliceIndex !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentSliceIndex;
        const velocity = (1 - progress) * 2;
        soundFx.playTick(velocity);

        // Needle wobble
        setNeedleDeflection((Math.random() > 0.5 ? 1 : -1) * Math.min(12 * (1 - progress), 14));
        setTimeout(() => setNeedleDeflection(0), 45);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        currentRotationRef.current = finalRotation;
        drawWheel(finalRotation);
        setNeedleDeflection(0);

        // Calculate winning index precisely
        const finalNormalizedAngle = (finalRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const finalRelative = (POINTER_ANGLE - finalNormalizedAngle + Math.PI * 4) % (Math.PI * 2);
        const winnerIndex = Math.floor(finalRelative / sliceAngle) % numSlices;
        const winner = items[winnerIndex];

        soundFx.playWin();
        onSpinEnd(winner);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, numSlices, onSpinStart, onSpinEnd, drawWheel, sliceAngle, items]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Top Pointer Needle with 3D aesthetic and physics deflection */}
      <div
        className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(-50%) rotate(${needleDeflection}deg)`,
          left: '50%',
          transformOrigin: '50% 12px',
        }}
      >
        {/* Needle Top Jewel Cap */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 shadow-md border border-amber-800 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-red-600 shadow-inner" />
        </div>

        {/* Triangle Pointer Head */}
        <div
          className="w-0 h-0 -mt-1.5"
          style={{
            borderLeft: '11px solid transparent',
            borderRight: '11px solid transparent',
            borderTop: '28px solid #DC2626',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
          }}
        />
      </div>

      {/* Main Wheel Canvas Container */}
      <div
        className={`relative rounded-full transition-transform duration-200 ${
          isSpinning ? 'scale-[1.01]' : 'hover:scale-[1.015]'
        }`}
        style={{ width: '440px', height: '440px', maxWidth: '90vw', maxHeight: '90vw' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
          className="cursor-pointer"
          onClick={startSpin}
          aria-label="Vòng quay chọn món ăn trưa Hoàn Kiếm"
        />

        {/* Central Overlay Spin Action Button */}
        <button
          onClick={startSpin}
          disabled={isSpinning || numSlices < 2}
          type="button"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center z-20 transition-all duration-200 font-bold text-xs uppercase tracking-wider ${
            isSpinning
              ? 'bg-amber-600 text-white cursor-wait opacity-90 scale-95'
              : 'bg-gradient-to-b from-red-600 to-red-700 text-white shadow-xl hover:from-red-500 hover:to-red-600 hover:shadow-2xl active:scale-95 cursor-pointer border-2 border-amber-300'
          }`}
          style={{
            boxShadow: isSpinning
              ? '0 0 15px rgba(217, 119, 6, 0.6)'
              : '0 8px 24px rgba(220, 38, 38, 0.4)',
          }}
        >
          {isSpinning ? (
            <span className="text-[11px] leading-tight text-amber-100">Đang<br />quay...</span>
          ) : (
            <>
              <span className="text-[13px] tracking-widest text-amber-200 drop-shadow">QUAY</span>
              <span className="text-[9px] text-amber-100 opacity-90">NGAY</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom hint */}
      <p className="mt-4 text-xs text-slate-500 text-center">
        {isSpinning
          ? 'Đang tìm món ngon nhất trưa nay...'
          : 'Nhấn vào nút giữa hoặc tâm vòng quay để chọn món'}
      </p>
    </div>
  );
};
