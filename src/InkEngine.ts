import { 
  Point, 
  Stroke, 
  BrushSettings, 
  CanvasSettings, 
  InkEngineOptions, 
  RenderOptions,
  InkEngine 
} from './types';

export class InkEngineImpl implements InkEngine {
  private strokes: Map<string, Stroke> = new Map();
  private options: InkEngineOptions;
  private currentStrokeId: string | null = null;
  private isInitialized = false;

  async init(options: InkEngineOptions): Promise<void> {
    this.options = options;
    this.isInitialized = true;
  }

  addStroke(stroke: Stroke): void {
    if (!this.isInitialized) {
      throw new Error('InkEngine not initialized');
    }
    
    // Применяем сглаживание если включено
    const processedStroke = this.options.smoothing.enabled 
      ? this.smoothStroke(stroke)
      : stroke;
    
    this.strokes.set(stroke.id, processedStroke);
  }

  updateStroke(id: string, stroke: Partial<Stroke>): void {
    if (!this.isInitialized) {
      throw new Error('InkEngine not initialized');
    }
    
    const existingStroke = this.strokes.get(id);
    if (!existingStroke) {
      throw new Error(`Stroke with id ${id} not found`);
    }
    
    const updatedStroke = { ...existingStroke, ...stroke };
    this.strokes.set(id, updatedStroke);
  }

  removeStroke(id: string): void {
    this.strokes.delete(id);
  }

  getStroke(id: string): Stroke | null {
    return this.strokes.get(id) || null;
  }

  getAllStrokes(): Stroke[] {
    return Array.from(this.strokes.values());
  }

  render(ctx: CanvasRenderingContext2D, options: RenderOptions = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    showPressure: false,
    showTilt: false
  }): void {
    if (!this.isInitialized) {
      throw new Error('InkEngine not initialized');
    }

    // Очищаем canvas
    ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height);
    
    // Рендерим фон
    if (this.options.canvas.backgroundColor) {
      ctx.fillStyle = this.options.canvas.backgroundColor;
      ctx.fillRect(0, 0, this.options.canvas.width, this.options.canvas.height);
    }

    // Рендерим сетку если включена
    if (this.options.canvas.showGrid && this.options.canvas.gridSize) {
      this.renderGrid(ctx);
    }

    // Применяем трансформации
    ctx.save();
    ctx.translate(options.offsetX, options.offsetY);
    ctx.scale(options.scale, options.scale);
    if (options.rotation !== 0) {
      ctx.rotate(options.rotation);
    }

    // Рендерим все штрихи
    for (const stroke of this.strokes.values()) {
      this.renderStroke(ctx, stroke, options);
    }

    ctx.restore();
  }

  renderStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, options: RenderOptions = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    showPressure: false,
    showTilt: false
  }): void {
    if (stroke.points.length < 2) return;

    ctx.save();
    
    // Настраиваем стиль штриха
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.globalAlpha = stroke.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Настраиваем режим смешивания для разных инструментов
    switch (stroke.tool) {
      case 'highlighter':
        ctx.globalCompositeOperation = 'multiply';
        ctx.lineWidth = stroke.width * 2; // Маркер шире
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        break;
      default:
        ctx.globalCompositeOperation = 'source-over';
    }

    // Рендерим штрих
    ctx.beginPath();
    
    for (let i = 0; i < stroke.points.length; i++) {
      const point = stroke.points[i];
      
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        // Применяем давление к ширине линии
        if (options.showPressure && stroke.tool === 'pen') {
          const pressureWidth = stroke.width * (0.5 + point.pressure * 0.5);
          ctx.lineWidth = pressureWidth;
        }
        
        ctx.lineTo(point.x, point.y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }

  startStroke(point: Point): string {
    const strokeId = `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stroke: Stroke = {
      id: strokeId,
      points: [point],
      color: this.options.brush.color,
      width: this.options.brush.width,
      opacity: this.options.brush.opacity,
      tool: this.options.brush.tool,
      layer: 0,
      createdAt: Date.now()
    };
    
    this.currentStrokeId = strokeId;
    this.strokes.set(strokeId, stroke);
    return strokeId;
  }

  updateStrokePoint(strokeId: string, point: Point): void {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return;
    
    stroke.points.push(point);
    
    // Ограничиваем количество точек для производительности
    if (stroke.points.length > this.options.performance.maxPoints) {
      stroke.points = stroke.points.slice(-this.options.performance.maxPoints);
    }
  }

  endStroke(strokeId: string): void {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return;
    
    // Применяем сглаживание к завершённому штриху
    if (this.options.smoothing.enabled) {
      const smoothedStroke = this.smoothStroke(stroke);
      this.strokes.set(strokeId, smoothedStroke);
    }
    
    this.currentStrokeId = null;
  }

  smoothStroke(stroke: Stroke): Stroke {
    if (stroke.points.length < 3) return stroke;
    
    const smoothedPoints = [...stroke.points];
    const factor = this.options.smoothing.factor;
    const iterations = this.options.smoothing.iterations;
    
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 1; i < smoothedPoints.length - 1; i++) {
        const prev = smoothedPoints[i - 1];
        const curr = smoothedPoints[i];
        const next = smoothedPoints[i + 1];
        
        smoothedPoints[i] = {
          x: curr.x + factor * (prev.x + next.x - 2 * curr.x),
          y: curr.y + factor * (prev.y + next.y - 2 * curr.y),
          pressure: curr.pressure,
          tilt: curr.tilt,
          timestamp: curr.timestamp
        };
      }
    }
    
    return { ...stroke, points: smoothedPoints };
  }

  optimizeStroke(stroke: Stroke): Stroke {
    if (stroke.points.length < 3) return stroke;
    
    const optimizedPoints: Point[] = [stroke.points[0]];
    const threshold = 1.0; // Минимальное расстояние между точками
    
    for (let i = 1; i < stroke.points.length - 1; i++) {
      const prev = optimizedPoints[optimizedPoints.length - 1];
      const curr = stroke.points[i];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      
      if (distance > threshold) {
        optimizedPoints.push(curr);
      }
    }
    
    // Всегда добавляем последнюю точку
    optimizedPoints.push(stroke.points[stroke.points.length - 1]);
    
    return { ...stroke, points: optimizedPoints };
  }

  exportStrokes(): string {
    return JSON.stringify(Array.from(this.strokes.values()));
  }

  importStrokes(data: string): void {
    const strokes = JSON.parse(data) as Stroke[];
    this.strokes.clear();
    strokes.forEach(stroke => this.strokes.set(stroke.id, stroke));
  }

  renderGrid(ctx: CanvasRenderingContext2D): void {
    if (!this.options.canvas.gridSize) return;
    
    const gridSize = this.options.canvas.gridSize;
    const gridColor = this.options.canvas.gridColor || '#e0e0e0';
    
    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.5;
    
    // Вертикальные линии
    for (let x = 0; x <= this.options.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.options.canvas.height);
      ctx.stroke();
    }
    
    // Горизонтальные линии
    for (let y = 0; y <= this.options.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.options.canvas.width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  clear(): void {
    this.strokes.clear();
    this.currentStrokeId = null;
  }

  destroy(): void {
    this.clear();
    this.isInitialized = false;
  }
}

// Экспортируем фабричную функцию
export const createInkEngine = (): InkEngine => new InkEngineImpl();
