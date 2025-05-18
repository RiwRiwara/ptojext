"use client";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiGrid } from 'react-icons/fi';

interface GridControlsProps {
  rows: number;
  cols: number;
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  allowDiagonal: boolean;
  setAllowDiagonal: (allow: boolean) => void;
  showVisitedCells: boolean;
  setShowVisitedCells: (show: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  mazeType: 'random' | 'maze';
  setMazeType: (type: 'random' | 'maze') => void;
  mazeDensity: number;
  setMazeDensity: (density: number) => void;
  generateMaze: () => void;
  isRunning: boolean;
}

export const GridControls = ({
  rows,
  cols,
  setRows,
  setCols,
  allowDiagonal,
  setAllowDiagonal,
  showVisitedCells,
  setShowVisitedCells,
  animationSpeed,
  setAnimationSpeed,
  mazeType,
  setMazeType,
  mazeDensity,
  setMazeDensity,
  generateMaze,
  isRunning
}: GridControlsProps) => {
  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-medium flex items-center">
        <FiGrid className="mr-2" />
        Grid Settings
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grid Size Controls */}
        <div className="space-y-2">
          <Label htmlFor="grid-rows">Rows: {rows}</Label>
          <Slider
            id="grid-rows"
            min={5}
            max={40}
            step={5}
            value={[rows]}
            onValueChange={(value) => setRows(value[0])}
            disabled={isRunning}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="grid-cols">Columns: {cols}</Label>
          <Slider
            id="grid-cols"
            min={5}
            max={50}
            step={5}
            value={[cols]}
            onValueChange={(value) => setCols(value[0])}
            disabled={isRunning}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diagonal Movement Switch */}
        <div className="flex items-center justify-between">
          <Label htmlFor="diagonal-movement" className="cursor-pointer">Allow Diagonal Movement</Label>
          <Switch
            id="diagonal-movement"
            checked={allowDiagonal}
            onCheckedChange={setAllowDiagonal}
            disabled={isRunning}
          />
        </div>
        
        {/* Show Visited Cells Switch */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-visited" className="cursor-pointer">Show Visited Cells</Label>
          <Switch
            id="show-visited"
            checked={showVisitedCells}
            onCheckedChange={setShowVisitedCells}
            disabled={isRunning}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Animation Speed Slider */}
        <div className="space-y-2">
          <Label htmlFor="animation-speed">Animation Speed: {animationSpeed}</Label>
          <Slider
            id="animation-speed"
            min={1}
            max={50}
            step={1}
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            disabled={isRunning}
          />
        </div>
        
        {/* Maze Type Select */}
        <div className="space-y-2">
          <Label htmlFor="maze-type">Obstacle Pattern</Label>
          <Select 
            value={mazeType} 
            onValueChange={(val: 'random' | 'maze') => setMazeType(val)} 
            disabled={isRunning}
          >
            <SelectTrigger id="maze-type" className="w-full">
              <SelectValue placeholder="Maze Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random Obstacles</SelectItem>
              <SelectItem value="maze">Maze Pattern</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Maze Density (only for random obstacles) */}
      {mazeType === 'random' && (
        <div className="space-y-2">
          <Label htmlFor="maze-density">Obstacle Density: {mazeDensity}%</Label>
          <Slider
            id="maze-density"
            min={5}
            max={50}
            step={5}
            value={[mazeDensity]}
            onValueChange={(value) => setMazeDensity(value[0])}
            disabled={isRunning}
          />
        </div>
      )}
    </div>
  );
};
