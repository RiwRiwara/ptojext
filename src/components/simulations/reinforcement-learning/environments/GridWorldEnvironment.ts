import { 
  RLEnvironment, 
  State, 
  Action, 
  StepResult, 
  GridWorldCell, 
  EnvironmentConfig 
} from '../types/reinforcement-learning-types';

export class GridWorldEnvironment implements RLEnvironment {
  private gridSize: number;
  private grid: GridWorldCell[][];
  private agentPos: { x: number; y: number };
  private startPos: { x: number; y: number };
  private goalPos: { x: number; y: number };
  private obstacles: { x: number; y: number }[];
  private actions: Action[];
  private maxSteps: number;
  private currentStep: number;

  constructor(config: EnvironmentConfig = {}) {
    this.gridSize = config.gridSize || 10;
    this.startPos = config.startPosition || { x: 0, y: 0 };
    this.goalPos = config.goalPosition || { x: this.gridSize - 1, y: this.gridSize - 1 };
    this.obstacles = config.obstacles || [];
    this.maxSteps = config.maxSteps || 100;
    this.currentStep = 0;
    this.agentPos = { ...this.startPos };

    // Define actions: 0:up, 1:right, 2:down, 3:left
    this.actions = [
      { id: 0, name: 'up' },
      { id: 1, name: 'right' },
      { id: 2, name: 'down' },
      { id: 3, name: 'left' }
    ];

    // Initialize grid
    this.grid = this.initializeGrid();
  }

  private initializeGrid(): GridWorldCell[][] {
    const grid: GridWorldCell[][] = [];
    
    // Create empty grid
    for (let y = 0; y < this.gridSize; y++) {
      grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        grid[y][x] = {
          x,
          y,
          type: 'empty',
          reward: -0.1 // Small negative reward for each step
        };
      }
    }
    
    // Add obstacles
    for (const obstacle of this.obstacles) {
      if (obstacle.x >= 0 && obstacle.x < this.gridSize && 
          obstacle.y >= 0 && obstacle.y < this.gridSize) {
        grid[obstacle.y][obstacle.x].type = 'obstacle';
        grid[obstacle.y][obstacle.x].reward = -1; // Penalty for hitting obstacle
      }
    }
    
    // Add goal
    if (this.goalPos.x >= 0 && this.goalPos.x < this.gridSize && 
        this.goalPos.y >= 0 && this.goalPos.y < this.gridSize) {
      grid[this.goalPos.y][this.goalPos.x].type = 'goal';
      grid[this.goalPos.y][this.goalPos.x].reward = 1; // Reward for reaching goal
    }
    
    // Add start
    if (this.startPos.x >= 0 && this.startPos.x < this.gridSize && 
        this.startPos.y >= 0 && this.startPos.y < this.gridSize) {
      grid[this.startPos.y][this.startPos.x].type = 'start';
    }
    
    return grid;
  }

  reset(): State {
    this.agentPos = { ...this.startPos };
    this.currentStep = 0;
    return this.getState();
  }

  getState(): State {
    return {
      agentX: this.agentPos.x,
      agentY: this.agentPos.y,
    };
  }

  getStateKey(state: State): string {
    return `${state.agentX},${state.agentY}`;
  }

  getActions(): Action[] {
    return this.actions;
  }

  step(action: Action): StepResult {
    const currentState = this.getState();
    const currentPos = { ...this.agentPos };
    this.currentStep++;

    // Calculate next position based on action
    let nextPos = { ...currentPos };
    
    switch (action.id) {
      case 0: // Up
        nextPos.y = Math.max(0, currentPos.y - 1);
        break;
      case 1: // Right
        nextPos.x = Math.min(this.gridSize - 1, currentPos.x + 1);
        break;
      case 2: // Down
        nextPos.y = Math.min(this.gridSize - 1, currentPos.y + 1);
        break;
      case 3: // Left
        nextPos.x = Math.max(0, currentPos.x - 1);
        break;
    }

    // Check if next position is an obstacle
    const isObstacle = this.obstacles.some(
      obs => obs.x === nextPos.x && obs.y === nextPos.y
    );

    if (isObstacle) {
      // Stay in current position if hitting an obstacle
      nextPos = { ...currentPos };
    }

    // Update agent position
    this.agentPos = nextPos;

    // Get the cell at the new position
    const cell = this.grid[this.agentPos.y][this.agentPos.x];
    const reward = cell.reward;
    
    // Check if goal reached or max steps exceeded
    const isGoal = this.agentPos.x === this.goalPos.x && this.agentPos.y === this.goalPos.y;
    const isDone = isGoal || this.currentStep >= this.maxSteps;

    // Add bonus reward for reaching goal
    const finalReward = isGoal ? reward + 9 : reward;

    return {
      state: currentState,
      action,
      reward: finalReward,
      nextState: this.getState(),
      done: isDone,
      episode: 0, // This will be updated by the hook
      totalReward: 0 // This will be updated by the hook
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = ctx.canvas;
    const cellSize = Math.min(canvas.width, canvas.height) / this.gridSize;
    
    // Draw grid
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const cell = this.grid[y][x];
        const xPos = x * cellSize;
        const yPos = y * cellSize;
        
        // Set fill color based on cell type
        switch (cell.type) {
          case 'empty':
            ctx.fillStyle = '#f9fafb';
            break;
          case 'obstacle':
            ctx.fillStyle = '#4b5563';
            break;
          case 'goal':
            ctx.fillStyle = '#10b981';
            break;
          case 'start':
            ctx.fillStyle = '#3b82f6';
            break;
        }
        
        // Draw cell
        ctx.fillRect(xPos, yPos, cellSize, cellSize);
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(xPos, yPos, cellSize, cellSize);
        
        // Draw cell coordinates (optional)
        // ctx.fillStyle = '#9ca3af';
        // ctx.font = `${cellSize * 0.2}px Arial`;
        // ctx.fillText(`${x},${y}`, xPos + cellSize * 0.1, yPos + cellSize * 0.2);
      }
    }
    
    // Draw agent
    const agentX = this.agentPos.x * cellSize + cellSize / 2;
    const agentY = this.agentPos.y * cellSize + cellSize / 2;
    const radius = cellSize * 0.35;
    
    ctx.beginPath();
    ctx.arc(agentX, agentY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red
    ctx.fill();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw goal marker
    const goalX = this.goalPos.x * cellSize + cellSize / 2;
    const goalY = this.goalPos.y * cellSize + cellSize / 2;
    
    ctx.fillStyle = '#10b981'; // Green
    ctx.beginPath();
    const flagSize = cellSize * 0.4;
    ctx.moveTo(goalX - flagSize / 2, goalY - flagSize / 2);
    ctx.lineTo(goalX - flagSize / 2, goalY + flagSize / 2);
    ctx.lineTo(goalX + flagSize / 2, goalY);
    ctx.closePath();
    ctx.fill();
  }
}
