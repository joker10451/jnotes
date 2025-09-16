'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { createInkEngine, InkEngine, Point, BrushSettings, CanvasSettings } from '@jnotes/ink-engine';

interface InkCanvasProps {
  width: number;
  height: number;
  brushSettings: BrushSettings;
  canvasSettings: CanvasSettings;
  onStrokeComplete?: (stroke: any) => void;
  className?: string;
}

export const InkCanvas: React.FC<InkCanvasProps> = ({
  width,
  height,
  brushSettings,
  canvasSettings,
  onStrokeComplete,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkEngineRef = useRef<InkEngine | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);

  // Инициализация ink-engine
  useEffect(() => {
    const initEngine = async () => {
      const engine = createInkEngine();
      await engine.init({
        canvas: canvasSettings,
        brush: brushSettings,
        smoothing: {
          enabled: true,
          factor: 0.5,
          iterations: 2
        },
        performance: {
          maxPoints: 1000,
          batchSize: 50,
          renderThreshold: 16
        }
      });
      inkEngineRef.current = engine;
    };

    initEngine();

    return () => {
      if (inkEngineRef.current) {
        inkEngineRef.current.destroy();
      }
    };
  }, []);

  // Обновление настроек кисти
  useEffect(() => {
    if (inkEngineRef.current) {
      // Обновляем настройки кисти в движке
      // Это можно реализовать через метод updateBrushSettings в InkEngine
    }
  }, [brushSettings]);

  // Рендеринг
  const render = useCallback(() => {
    if (!inkEngineRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    inkEngineRef.current.render(ctx, {
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      showPressure: true,
      showTilt: false
    });
  }, []);

  // Обработка начала рисования
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (!inkEngineRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const point: Point = {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      pressure: event.pressure || 0.5,
      tilt: 0, // Можно добавить поддержку наклона
      timestamp: Date.now()
    };

    const strokeId = inkEngineRef.current.startStroke(point);
    setCurrentStrokeId(strokeId);
    setIsDrawing(true);

    // Захватываем указатель для отслеживания движения
    canvas.setPointerCapture(event.pointerId);
  }, []);

  // Обработка движения указателя
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!isDrawing || !inkEngineRef.current || !canvasRef.current || !currentStrokeId) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const point: Point = {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      pressure: event.pressure || 0.5,
      tilt: 0,
      timestamp: Date.now()
    };

    inkEngineRef.current.updateStrokePoint(currentStrokeId, point);
    render();
  }, [isDrawing, currentStrokeId, render]);

  // Обработка окончания рисования
  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (!isDrawing || !inkEngineRef.current || !currentStrokeId) return;

    inkEngineRef.current.endStroke(currentStrokeId);
    
    // Получаем завершённый штрих
    const stroke = inkEngineRef.current.getStroke(currentStrokeId);
    if (stroke && onStrokeComplete) {
      onStrokeComplete(stroke);
    }

    setCurrentStrokeId(null);
    setIsDrawing(false);

    // Освобождаем захват указателя
    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(event.pointerId);
    }
  }, [isDrawing, currentStrokeId, onStrokeComplete]);

  // Обработка отмены рисования
  const handlePointerCancel = useCallback((event: React.PointerEvent) => {
    if (currentStrokeId && inkEngineRef.current) {
      inkEngineRef.current.removeStroke(currentStrokeId);
    }
    setCurrentStrokeId(null);
    setIsDrawing(false);
  }, [currentStrokeId]);

  // Обработка изменения размера canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размер canvas
    canvas.width = width;
    canvas.height = height;

    // Настраиваем контекст для высокого DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    render();
  }, [width, height, render]);

  return (
    <Paper
      elevation={1}
      sx={{
        width: width,
        height: height,
        position: 'relative',
        overflow: 'hidden',
        cursor: isDrawing ? 'crosshair' : 'default',
        touchAction: 'none', // Отключаем стандартные жесты браузера
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню
      />
    </Paper>
  );
};
