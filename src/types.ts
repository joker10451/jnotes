// Типы для ink-engine

export interface Point {
  x: number;
  y: number;
  pressure: number;
  tilt: number;
  timestamp: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  tool: 'pen' | 'highlighter' | 'eraser';
  layer: number;
  createdAt: number;
}

export interface BrushSettings {
  color: string;
  width: number;
  opacity: number;
  tool: 'pen' | 'highlighter' | 'eraser';
  smoothing: boolean;
  pressureSensitivity: boolean;
  tiltSensitivity: boolean;
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  gridSize?: number;
  gridColor?: string;
  showGrid?: boolean;
}

export interface InkEngineOptions {
  canvas: CanvasSettings;
  brush: BrushSettings;
  smoothing: {
    enabled: boolean;
    factor: number;
    iterations: number;
  };
  performance: {
    maxPoints: number;
    batchSize: number;
    renderThreshold: number;
  };
}

export interface RenderOptions {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  showPressure: boolean;
  showTilt: boolean;
}

export interface InkEngine {
  // Инициализация
  init(options: InkEngineOptions): Promise<void>;
  
  // Управление штрихами
  addStroke(stroke: Stroke): void;
  updateStroke(id: string, stroke: Partial<Stroke>): void;
  removeStroke(id: string): void;
  getStroke(id: string): Stroke | null;
  getAllStrokes(): Stroke[];
  
  // Рендеринг
  render(ctx: CanvasRenderingContext2D, options?: RenderOptions): void;
  renderStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, options?: RenderOptions): void;
  
  // Обработка ввода
  startStroke(point: Point): string;
  updateStrokePoint(strokeId: string, point: Point): void;
  endStroke(strokeId: string): void;
  
  // Утилиты
  smoothStroke(stroke: Stroke): Stroke;
  optimizeStroke(stroke: Stroke): Stroke;
  exportStrokes(): string;
  importStrokes(data: string): void;
  
  // Очистка
  clear(): void;
  destroy(): void;
}
