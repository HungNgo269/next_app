"use client";

import { useEffect, useRef } from "react";

interface LoginCanvasProps {
  width?: "half" | "third";
  className?: string;
}

export function LoginCanvas({
  width = "third",
  className = "",
}: LoginCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "oklch(0.98 0.02 200)"); // Very light cyan
      gradient.addColorStop(0.5, "oklch(0.96 0.05 240)"); // Light cyan-purple blend
      gradient.addColorStop(1, "oklch(0.94 0.08 280)"); // Light purple

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw flowing abstract shapes
      ctx.globalAlpha = 0.1;

      // Large flowing shape 1
      ctx.beginPath();
      ctx.fillStyle = "oklch(0.55 0.15 200)"; // Primary cyan
      ctx.ellipse(
        width * 0.2,
        height * 0.3,
        width * 0.4,
        height * 0.2,
        Math.PI / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Large flowing shape 2
      ctx.beginPath();
      ctx.fillStyle = "oklch(0.65 0.2 280)"; // Purple accent
      ctx.ellipse(
        width * 0.8,
        height * 0.7,
        width * 0.3,
        height * 0.25,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Smaller accent shapes
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const x = width * 0.1 + i * width * 0.12;
        const y = height * 0.1 + Math.sin(i * 0.5) * height * 0.8;
        const radius = width * 0.02 + Math.sin(i) * width * 0.01;
        ctx.fillStyle =
          i % 2 === 0 ? "oklch(0.55 0.15 200)" : "oklch(0.65 0.2 280)";
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Geometric lines
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "oklch(0.55 0.15 200)";
      ctx.lineWidth = 2;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const startY = height * 0.2 + i * height * 0.15;
        const endY = startY + height * 0.1;
        const startX = width * 0.1;
        const endX = width * 0.9;

        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(width * 0.5, endY - height * 0.05, endX, endY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop for subtle movement
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Redraw with slight variations
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Animated gradient
      const gradient = ctx.createLinearGradient(
        Math.sin(time) * width * 0.1,
        0,
        width + Math.cos(time * 0.7) * width * 0.1,
        height
      );
      gradient.addColorStop(0, "oklch(0.98 0.02 200)");
      gradient.addColorStop(0.5, "oklch(0.96 0.05 240)");
      gradient.addColorStop(1, "oklch(0.94 0.08 280)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Animated shapes with subtle movement
      ctx.globalAlpha = 0.1 + Math.sin(time) * 0.02;

      ctx.beginPath();
      ctx.fillStyle = "oklch(0.55 0.15 200)";
      ctx.ellipse(
        width * 0.2 + Math.sin(time * 0.5) * width * 0.02,
        height * 0.3 + Math.cos(time * 0.3) * height * 0.02,
        width * 0.4,
        height * 0.2,
        Math.PI / 6 + Math.sin(time * 0.2) * 0.1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "oklch(0.65 0.2 280)";
      ctx.ellipse(
        width * 0.8 + Math.cos(time * 0.4) * width * 0.02,
        height * 0.7 + Math.sin(time * 0.6) * height * 0.02,
        width * 0.3,
        height * 0.25,
        -Math.PI / 4 + Math.cos(time * 0.3) * 0.1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const widthClass = width === "half" ? "w-1/2" : "w-1/3";

  return (
    <div
      className={`${widthClass} h-screen bg-sidebar relative overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-popover/20 to-popover/40" />

      {/* Optional content overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold text-sidebar-foreground/80">
            Welcome Back
          </h2>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            Sign in to continue your journey with us
          </p>
        </div>
      </div>
    </div>
  );
}
