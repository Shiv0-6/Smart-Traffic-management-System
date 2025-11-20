"use client";

import React, { useRef, useEffect } from "react";
import type { SumoVehicle } from "@/hooks/use-sumo";

interface Props {
  vehicles?: SumoVehicle[];
}

export const SumoCanvas: React.FC<Props> = ({ vehicles = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mounted = true;

    function draw() {
      if (!mounted) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.fillStyle = "#1f1724";
      ctx.fillRect(0, 0, width, height);

      // Draw roads (simple cross)
      const roadW = Math.min(width, height) * 0.18;
      ctx.fillStyle = "#2b2430";
      // horizontal
      ctx.fillRect(0, (height - roadW) / 2, width, roadW);
      // vertical
      ctx.fillRect((width - roadW) / 2, 0, roadW, height);

      // center intersection accent
      ctx.fillStyle = "#2f2733";
      ctx.fillRect((width - roadW) / 2, (height - roadW) / 2, roadW, roadW);

      // draw vehicles with subtle pulsing to indicate motion
      const t = Date.now() / 1000;
      vehicles.forEach((v, i) => {
        // positions originally in 800x600 range (per hook), scale to canvas
        const x = (v.position.x / 800) * width;
        const y = (v.position.y / 600) * height;

        // choose color
        let color = "#3b82f6"; // car - blue
        if (v.type === "truck") color = "#f97316"; // orange
        if (v.type === "bus") color = "#10b981"; // green

        // pulsing radius
        const pulse = 1.5 * Math.sin(t * 2 + i) + 1.5; // between 0 and ~3
        const r = Math.max(4, 6 + pulse);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 6;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [vehicles]);

  return (
    <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", borderRadius: 8 }} />
  );
};

export default SumoCanvas;
