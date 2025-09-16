'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Button,
  Slider,
  Typography,
  Divider,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  Edit as PenIcon,
  Highlight as HighlighterIcon,
  AutoFixHigh as EraserIcon,
  Palette as ColorIcon,
  Tune as SettingsIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Clear as ClearIcon,
  GridOn as GridIcon,
  Layers as LayerIcon,
} from '@mui/icons-material';
import { BrushSettings } from '@jnotes/ink-engine';

interface InkToolbarProps {
  brushSettings: BrushSettings;
  onBrushSettingsChange: (settings: BrushSettings) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onToggleGrid?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  showGrid?: boolean;
}

const TOOLS = [
  { id: 'pen', icon: <PenIcon />, label: 'Ручка' },
  { id: 'highlighter', icon: <HighlighterIcon />, label: 'Маркер' },
  { id: 'eraser', icon: <EraserIcon />, label: 'Ластик' },
] as const;

const COLORS = [
  '#000000', // Чёрный
  '#1976d2', // Синий
  '#388e3c', // Зелёный
  '#f57c00', // Оранжевый
  '#d32f2f', // Красный
  '#7b1fa2', // Фиолетовый
  '#5d4037', // Коричневый
  '#455a64', // Серый
];

const WIDTH_PRESETS = [1, 2, 4, 8, 16, 32];

export const InkToolbar: React.FC<InkToolbarProps> = ({
  brushSettings,
  onBrushSettingsChange,
  onUndo,
  onRedo,
  onClear,
  onToggleGrid,
  canUndo = false,
  canRedo = false,
  showGrid = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToolChange = (tool: 'pen' | 'highlighter' | 'eraser') => {
    onBrushSettingsChange({
      ...brushSettings,
      tool,
    });
  };

  const handleColorChange = (color: string) => {
    onBrushSettingsChange({
      ...brushSettings,
      color,
    });
    setShowColorPicker(false);
  };

  const handleWidthChange = (width: number) => {
    onBrushSettingsChange({
      ...brushSettings,
      width,
    });
  };

  const handleOpacityChange = (opacity: number) => {
    onBrushSettingsChange({
      ...brushSettings,
      opacity: opacity / 100,
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 280,
        maxWidth: 320,
      }}
    >
      {/* Инструменты */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Инструменты
        </Typography>
        <Stack direction="row" spacing={1}>
          {TOOLS.map((tool) => (
            <Tooltip key={tool.id} title={tool.label}>
              <IconButton
                onClick={() => handleToolChange(tool.id as any)}
                color={brushSettings.tool === tool.id ? 'primary' : 'default'}
                sx={{
                  border: brushSettings.tool === tool.id ? 2 : 1,
                  borderColor: brushSettings.tool === tool.id ? 'primary.main' : 'divider',
                }}
              >
                {tool.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* Цвета */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Цвет
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {COLORS.map((color) => (
            <Tooltip key={color} title={color}>
              <Box
                onClick={() => handleColorChange(color)}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: brushSettings.color === color ? 3 : 1,
                  borderColor: brushSettings.color === color ? 'primary.main' : 'divider',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </Tooltip>
          ))}
          <Tooltip title="Дополнительные цвета">
            <IconButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              sx={{
                width: 32,
                height: 32,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <ColorIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Divider />

      {/* Толщина */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Толщина: {brushSettings.width}px
        </Typography>
        <Slider
          value={brushSettings.width}
          onChange={(_, value) => handleWidthChange(value as number)}
          min={1}
          max={50}
          step={1}
          marks={WIDTH_PRESETS.map((width) => ({ value: width, label: width }))}
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Прозрачность */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Прозрачность: {Math.round(brushSettings.opacity * 100)}%
        </Typography>
        <Slider
          value={brushSettings.opacity * 100}
          onChange={(_, value) => handleOpacityChange(value as number)}
          min={10}
          max={100}
          step={5}
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider />

      {/* Дополнительные настройки */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Настройки
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            icon={<SettingsIcon />}
            label="Сглаживание"
            color={brushSettings.smoothing ? 'primary' : 'default'}
            onClick={() =>
              onBrushSettingsChange({
                ...brushSettings,
                smoothing: !brushSettings.smoothing,
              })
            }
          />
          <Chip
            icon={<LayerIcon />}
            label="Давление"
            color={brushSettings.pressureSensitivity ? 'primary' : 'default'}
            onClick={() =>
              onBrushSettingsChange({
                ...brushSettings,
                pressureSensitivity: !brushSettings.pressureSensitivity,
              })
            }
          />
        </Stack>
      </Box>

      <Divider />

      {/* Действия */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Действия
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Отменить">
            <IconButton
              onClick={onUndo}
              disabled={!canUndo}
              color="inherit"
            >
              <UndoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Повторить">
            <IconButton
              onClick={onRedo}
              disabled={!canRedo}
              color="inherit"
            >
              <RedoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Очистить">
            <IconButton
              onClick={onClear}
              color="error"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Сетка">
            <IconButton
              onClick={onToggleGrid}
              color={showGrid ? 'primary' : 'default'}
            >
              <GridIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );
};
