"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Undo2, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawingCanvasProps {
  disabled?: boolean;
  onDrawingChange?: (hasDrawing: boolean) => void;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export default function DrawingCanvas({
  disabled = false,
  onDrawingChange,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#1e293b");

  const colors = ["#1e293b", "#2563eb", "#dc2626", "#16a34a", "#9333ea"];

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < rect.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Draw all strokes
    const allStrokes = currentStroke
      ? [...strokes, currentStroke]
      : strokes;

    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1];
        const curr = stroke.points[i];
        // Smooth with midpoint
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getPos = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) canvas.setPointerCapture(e.pointerId);

    const pos = getPos(e);
    setIsDrawing(true);
    setCurrentStroke({
      points: [pos],
      color: brushColor,
      width: brushSize,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || !currentStroke) return;
    e.preventDefault();
    const pos = getPos(e);
    setCurrentStroke((prev) =>
      prev ? { ...prev, points: [...prev.points, pos] } : null
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    setIsDrawing(false);

    if (currentStroke.points.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
      onDrawingChange?.(true);
    }
    setCurrentStroke(null);
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      const next = prev.slice(0, -1);
      // Defer parent update to avoid setState-during-render
      queueMicrotask(() => onDrawingChange?.(next.length > 0));
      return next;
    });
  };

  const handleClear = () => {
    setStrokes([]);
    onDrawingChange?.(false);
  };

  // Export canvas as base64 PNG
  const toDataURL = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return null;
    // Re-render at current resolution for export
    return canvas.toDataURL("image/png");
  }, [strokes]);

  // Expose toDataURL via ref-like pattern using a global
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__drawingCanvasExport = toDataURL;
    return () => {
      delete // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__drawingCanvasExport;
    };
  }, [toDataURL]);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Colors */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setBrushColor(c)}
              className={`size-6 rounded-full border-2 transition-transform ${
                brushColor === c
                  ? "border-ring scale-125"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
              disabled={disabled}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Brush size */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setBrushSize((s) => Math.max(1, s - 1))}
            disabled={disabled || brushSize <= 1}
          >
            <Minus className="size-3" />
          </Button>
          <span className="w-6 text-center text-xs text-muted-foreground">
            {brushSize}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setBrushSize((s) => Math.min(10, s + 1))}
            disabled={disabled || brushSize >= 10}
          >
            <Plus className="size-3" />
          </Button>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Actions */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={handleUndo}
          disabled={disabled || strokes.length === 0}
        >
          <Undo2 className="size-3.5 mr-1" />
          ย้อน
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={handleClear}
          disabled={disabled || strokes.length === 0}
        >
          <Trash2 className="size-3.5 mr-1" />
          ล้าง
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full rounded-lg border border-input bg-white touch-none ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
        style={{ height: 250 }}
      />

      <p className="text-xs text-muted-foreground">
        ใช้นิ้วหรือ Apple Pencil เขียนวิธีทำได้เลย
      </p>
    </div>
  );
}
