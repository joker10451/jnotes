'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { InkCanvas } from '@/components/Canvas/InkCanvas';
import { InkToolbar } from '@/components/Toolbar/InkToolbar';
import { BrushSettings, CanvasSettings } from '@jnotes/ink-engine';

export default function Home() {
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: '#000000',
    width: 2,
    opacity: 1,
    tool: 'pen',
    smoothing: true,
    pressureSensitivity: true,
    tiltSensitivity: false,
  });

  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    gridSize: 20,
    gridColor: '#e0e0e0',
    showGrid: false,
  });

  const [showGrid, setShowGrid] = useState(false);

  const handleStrokeComplete = (stroke: any) => {
    console.log('Stroke completed:', stroke);
  };

  const handleUndo = () => {
    console.log('Undo');
  };

  const handleRedo = () => {
    console.log('Redo');
  };

  const handleClear = () => {
    console.log('Clear');
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
    setCanvasSettings(prev => ({
      ...prev,
      showGrid: !showGrid
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JNotes
          </Typography>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <Button color="inherit" startIcon={<AddIcon />}>
            Новая страница
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, borderRight: 1, borderColor: 'divider' }}>
          <InkToolbar
            brushSettings={brushSettings}
            onBrushSettingsChange={setBrushSettings}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            onToggleGrid={handleToggleGrid}
            canUndo={false}
            canRedo={false}
            showGrid={showGrid}
          />
        </Box>

        {/* Canvas Area */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <InkCanvas
            width={canvasSettings.width}
            height={canvasSettings.height}
            brushSettings={brushSettings}
            canvasSettings={canvasSettings}
            onStrokeComplete={handleStrokeComplete}
          />
        </Box>
      </Box>
    </Box>
  );
}
