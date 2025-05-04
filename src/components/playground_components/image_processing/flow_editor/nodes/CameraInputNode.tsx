import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, Node, Edge } from '@xyflow/react';
import { TbCamera, TbTrash, TbCameraOff, TbAlertTriangle } from 'react-icons/tb';
import { FaCamera } from 'react-icons/fa';
import { useFlowStore } from '../store';
import { NodeParameter, ImageData, FlowState } from '../store';
import { NodeBase, ParameterControl } from './NodeBase';
import Image from 'next/image';

export function CameraInputNode({ data, id, selected }: NodeProps) {
  const [image, setImage] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [parameters, setParameters] = useState<NodeParameter[]>([]);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('prompt'); // 'prompt', 'granted', 'denied'
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Access the store directly to avoid TypeScript issues
  const store = useFlowStore.getState();

  // Create safe wrapper functions for store methods
  const safeSetNodeInputImage = (nodeId: string, imageData: ImageData) => {
    if (typeof store.setNodeInputImage === 'function') {
      store.setNodeInputImage(nodeId, imageData);
    }
  };

  const safeSetNodeOutputImage = (nodeId: string, imageData: ImageData) => {
    if (typeof store.setNodeOutputImage === 'function') {
      store.setNodeOutputImage(nodeId, imageData);
    }
  };

  const safeGetNodeOutputImage = (nodeId: string): ImageData => {
    if (typeof store.getNodeOutputImage === 'function') {
      return store.getNodeOutputImage(nodeId);
    }
    return null;
  };

  const safeProcessFlow = (nodes: Node[], edges: Edge[]) => {
    if (typeof store.processFlow === 'function') {
      store.processFlow(nodes, edges);
    }
  };

  const safeGetNodeParameters = (nodeId: string): NodeParameter[] => {
    if (typeof store.getNodeParameters === 'function') {
      return store.getNodeParameters(nodeId);
    }
    return [];
  };

  const safeUpdateNodeParameter = (nodeId: string, paramName: string, value: number | boolean | string) => {
    if (typeof store.updateNodeParameter === 'function') {
      store.updateNodeParameter(nodeId, paramName, value);
    }
  };

  // Check for camera permissions
  const checkCameraPermissions = async () => {
    try {
      // Check if permission API is supported
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(result.state);

        // Listen for permission changes
        result.onchange = () => {
          setPermissionState(result.state);
          if (result.state === 'granted') {
            setPermissionError(null);
          } else if (result.state === 'denied') {
            setPermissionError('Camera access denied. Please allow camera access in your browser settings.');
          }
        };

        return result.state;
      }
      return 'prompt'; // Default if permissions API not available
    } catch (err) {
      console.error('Error checking camera permissions:', err);
      return 'prompt';
    }
  };

  // Start the webcam stream
  const startWebcam = async () => {
    setPermissionError(null); // Reset any previous errors

    try {
      // First check permissions
      const permissionStatus = await checkCameraPermissions();

      // If already denied, show appropriate message
      if (permissionStatus === 'denied') {
        setPermissionError('Camera access denied. Please allow camera access in your browser settings.');
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      // Camera access granted
      setPermissionState('granted');
      setPermissionError(null);

      // Store the stream reference for cleanup
      streamRef.current = stream;

      // Connect the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error accessing webcam:', err);

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError('Camera access denied. Please allow camera access in your browser settings.');
          setPermissionState('denied');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setPermissionError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setPermissionError('Camera is already in use by another application or not accessible.');
        } else {
          setPermissionError(`Could not access webcam: ${err.message || 'Unknown error'}`);
        }
      } else {
        // Fallback for non-Error values
        setPermissionError('Unknown error occurred when accessing the webcam.');
      }
    }
  };

  // Stop the webcam stream
  const stopWebcam = () => {
    if (streamRef.current) {
      // Stop all tracks in the stream
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;

      // Clear the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setStreaming(false);
      // Don't reset permission error when stopping - it should persist
    }
  };

  // Toggle webcam on/off
  const toggleWebcam = () => {
    if (streaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  // Capture a still image from the video stream
  const captureImage = () => {
    if (!videoRef.current) return;

    try {
      // Create a canvas to capture the image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw the video frame to the canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);

      // Set the image data in the flow store using safe wrapper functions
      safeSetNodeInputImage(id as string, imageData);
      safeSetNodeOutputImage(id as string, imageData);

      // Process the flow with a delay to ensure images are set
      setTimeout(() => {
        safeProcessFlow([], []);
      }, 50);

    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  // Reset the image
  const handleReset = () => {
    setImage(null);
    safeSetNodeInputImage(id as string, null);
    safeSetNodeOutputImage(id as string, null);

    // Trigger flow processing to update connected nodes
    setTimeout(() => {
      safeProcessFlow([], []);
    }, 100);
  };

  // Cleanup webcam when component unmounts
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Load node parameters and check camera permissions on mount
  useEffect(() => {
    // Fetch node parameters
    const fetchParams = () => {
      try {
        const params = safeGetNodeParameters(id as string);
        setParameters(params || []);
      } catch (error) {
        console.error('Error fetching parameters:', error);
        setParameters([]);
      }
    };

    fetchParams();

    // Check camera permissions on component mount
    checkCameraPermissions();
  }, [id, safeGetNodeParameters]);

  // Check for output image from the store
  // Check for output image changes
  const checkOutputImage = () => {
    try {
      const outputImage = safeGetNodeOutputImage(id as string);
      if (outputImage && outputImage !== image) {
        setImage(outputImage);
      }
    } catch (error) {
      console.error('Error checking output image:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkOutputImage, 100);
    checkOutputImage();

    return () => clearInterval(intervalId);
  }, [id, image, checkOutputImage]);

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: number | boolean | string) => {
    setTimeout(() => {
      safeUpdateNodeParameter(id as string, paramName, value);
    }, 0);
  };

  // Create input section content
  const inputSectionContent = (
    <div className="bg-gray-50 rounded-md overflow-hidden relative">
      {streaming ? (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-auto rounded"
            style={{ maxHeight: '120px' }}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <button
              onClick={captureImage}
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
              title="Take photo"
            >
              <TbCamera size={16} />
            </button>
            <button
              onClick={toggleWebcam}
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              title="Stop camera"
            >
              <TbCameraOff size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center p-4 text-center">
          {permissionError ? (
            <div className="text-xs text-red-500 mb-2 bg-red-50 p-2 rounded flex items-start gap-1">
              <TbAlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{permissionError}</span>
            </div>
          ) : null}
          <button
            onClick={toggleWebcam}
            className="cursor-pointer text-sm text-gray-600 hover:text-[#83AFC9] flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
            disabled={permissionState === 'denied'}
          >
            <TbCamera className="text-gray-600" size={16} />
            <span>Open Camera</span>
          </button>
          {permissionState === 'denied' && (
            <div className="mt-2 text-xs text-gray-500">
              Camera blocked. Reset permissions in your browser settings.
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Create properties section content
  const propertiesSectionContent = parameters.length > 0 ? (
    <>
      {parameters.map((param) => (
        <ParameterControl
          key={param.name}
          parameter={param}
          onChange={handleParameterChange}
        />
      ))}
    </>
  ) : null;

  // Create output section content
  const outputSectionContent = (
    image ? (
      <div className="relative">
        <Image
          src={image}
          alt="Camera"
          className="w-full h-auto rounded border border-gray-200 max-h-24 object-cover"
          width={200}
          height={96}
        />
      </div>
    ) : (
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
        No image captured
      </div>
    )
  );

  // Create node right side with reset button
  const nodeRight = image ? (
    <button
      onClick={handleReset}
      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
      title="Remove image"
    >
      <TbTrash size={14} />
    </button>
  ) : null;

  // Create node handles
  const handles = (
    <Handle
      type="source"
      position={Position.Right}
      id="output"
      style={{ background: '#83AFC9', width: 10, height: 10 }}
    />
  );

  return (
    <NodeBase
      id={id}
      title={data.label as string}
      icon={<FaCamera size={16} />}
      type="imageInput" // Use imageInput type to ensure input section shows
      selected={selected}
      node={{ id, data, type: 'imageInput' } as Node}
      inputSection={inputSectionContent}
      propertiesSection={parameters.length > 0 ? {
        show: showProperties,
        setShow: setShowProperties,
        content: propertiesSectionContent
      } : undefined}
      outputSection={outputSectionContent}
      handles={handles}
    />
  );
}