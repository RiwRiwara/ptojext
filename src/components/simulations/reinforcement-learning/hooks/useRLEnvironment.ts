import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import {
  RLEnvironmentType,
  RLAlgorithm,
  RLEnvironment,
  State,
  Action,
  StepResult,
  AlgorithmParams,
  RLAlgorithmInterface
} from '../types/reinforcement-learning-types';
import { GridWorldEnvironment } from '../environments/GridWorldEnvironment';
import { CartPoleEnvironment } from '../environments/CartPoleEnvironment';
import { MountainCarEnvironment } from '../environments/MountainCarEnvironment';
import { QLearningAlgorithm } from '../algorithms/QLearningAlgorithm';
import { SarsaAlgorithm } from '../algorithms/SarsaAlgorithm';
import { DQNAlgorithm } from '../algorithms/DQNAlgorithm';

export const useRLEnvironment = (
  environmentType: RLEnvironmentType,
  algorithmType: RLAlgorithm,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  const [currentState, setCurrentState] = useState<State | null>(null);
  const [episode, setEpisode] = useState(0);
  const [episodeTotalReward, setEpisodeTotalReward] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const environmentRef = useRef<RLEnvironment | null>(null);
  const algorithmRef = useRef<RLAlgorithmInterface | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);

  // Initialize or update environment and algorithm when type changes
  useEffect(() => {
    // Initialize environment based on type
    switch (environmentType) {
      case 'gridworld':
        environmentRef.current = new GridWorldEnvironment({
          gridSize: 10,
          obstacles: [
            { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
            { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
            { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 },
          ],
          startPosition: { x: 0, y: 0 },
          goalPosition: { x: 9, y: 9 },
          maxSteps: 100
        });
        break;
      case 'cartpole':
        environmentRef.current = new CartPoleEnvironment({
          maxSteps: 500,
          successThreshold: 195
        });
        break;
      case 'mountaincar':
        environmentRef.current = new MountainCarEnvironment({
          maxSteps: 200,
          gravity: 0.0025,
          successThreshold: -110
        });
        break;
      default:
        environmentRef.current = new GridWorldEnvironment({});
        break;
    }

    // Initialize algorithm based on type
    switch (algorithmType) {
      case 'qlearning':
        algorithmRef.current = new QLearningAlgorithm({
          actions: environmentRef.current.getActions(),
          learningRate: 0.1,
          explorationRate: 0.2,
          discountFactor: 0.9
        });
        break;
      case 'sarsa':
        algorithmRef.current = new SarsaAlgorithm({
          actions: environmentRef.current.getActions(),
          learningRate: 0.1,
          explorationRate: 0.2,
          discountFactor: 0.9
        });
        break;
      case 'dqn':
        algorithmRef.current = new DQNAlgorithm({
          actions: environmentRef.current.getActions(),
          learningRate: 0.001,
          explorationRate: 0.1,
          discountFactor: 0.99,
          stateSize: Object.keys(environmentRef.current.getState()).length
        });
        break;
      default:
        algorithmRef.current = new QLearningAlgorithm({
          actions: environmentRef.current.getActions(),
          learningRate: 0.1,
          explorationRate: 0.2,
          discountFactor: 0.9
        });
        break;
    }

    resetEnvironment();
    startRendering();

    return () => {
      stopRendering();
    };
  }, [environmentType, algorithmType]);

  // Initialize the environment when type changes
  useEffect(() => {
    resetEnvironment();
    startRendering();
    
    return () => {
      stopRendering();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentType, algorithmType]);
  
  // NOTE: We're intentionally excluding resetEnvironment, startRendering, and stopRendering from the
  // dependency array as they are stable callback functions that would cause unnecessary re-renders

  // Start the rendering loop
  const startRendering = useCallback(() => {
    if (!canvasRef.current || !environmentRef.current) return;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      const environment = environmentRef.current;

      if (canvas && environment) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas size to match displayed size
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Render environment
          environment.render(ctx);
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [canvasRef]);

  // Stop the rendering loop
  const stopRendering = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Reset the environment and algorithm
  const resetEnvironment = useCallback(() => {
    if (!environmentRef.current || !algorithmRef.current) return;

    const initialState = environmentRef.current.reset();
    algorithmRef.current.reset();
    setCurrentState(initialState);
    setEpisode(0);
    setEpisodeTotalReward(0);
    stepCountRef.current = 0;
  }, []);

  // Take a step in the environment
  const stepEnvironment = useCallback((): StepResult | null => {
    if (!environmentRef.current || !algorithmRef.current || !currentState) return null;

    const action = algorithmRef.current.selectAction(currentState);
    const { state, action: resultAction, reward, nextState, done } = environmentRef.current.step(action);

    // Update the algorithm
    algorithmRef.current.update(state, resultAction, reward, nextState, done);

    // Update state and rewards
    setCurrentState(nextState);
    setEpisodeTotalReward(prev => prev + reward);
    stepCountRef.current += 1;

    // Handle episode completion
    if (done) {
      const newEpisode = episode + 1;
      setEpisode(newEpisode);
      environmentRef.current.reset();
      setEpisodeTotalReward(0);
      stepCountRef.current = 0;
    }

    return {
      state,
      action: resultAction,
      reward,
      nextState,
      done,
      episode: episode,
      totalReward: episodeTotalReward + reward
    };
  }, [currentState, episode, episodeTotalReward]);

  // Toggle training mode
  const toggleTraining = useCallback(() => {
    setIsTraining(prev => !prev);
  }, []);

  // Set algorithm parameters
  const setAlgorithmParams = useCallback((params: AlgorithmParams) => {
    if (algorithmRef.current) {
      algorithmRef.current.setParams(params);
    }
  }, []);

  return {
    environment: environmentRef.current,
    algorithm: algorithmRef.current,
    currentState,
    episode,
    episodeTotalReward,
    isTraining,
    resetEnvironment,
    stepEnvironment,
    toggleTraining,
    setAlgorithmParams
  };
};
