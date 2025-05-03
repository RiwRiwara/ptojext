import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { TbUpload, TbTrash, TbRefresh } from 'react-icons/tb';
import { FaImage } from 'react-icons/fa';
import { BiImageAdd } from 'react-icons/bi';
import { useFlowStore } from '../store';
import { NodeParameter } from '../store';
import { NodeBase, ParameterControl } from './NodeBase';

export function ImageInputNode({ data, id, selected }: NodeProps) {
  const [image, setImage] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [parameters, setParameters] = useState<NodeParameter[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Using individual selectors to prevent re-renders
  const setNodeInputImage = useFlowStore(state => state.setNodeInputImage);
  const setNodeOutputImage = useFlowStore(state => state.setNodeOutputImage);
  const getNodeOutputImage = useFlowStore(state => state.getNodeOutputImage);
  const processFlow = useFlowStore(state => state.processFlow);
  const getNodeParameters = useFlowStore(state => state.getNodeParameters);
  const updateNodeParameter = useFlowStore(state => state.updateNodeParameter);

  // Trigger the file input click when the button is clicked
  const triggerFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Directly trigger the click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When an image is uploaded, update the local state and the store
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setImageError(null);
    setIsUploading(true);

    try {
      const file = e.target.files?.[0];
      if (!file) {
        setIsUploading(false);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image too large (max 5MB)');
        setIsUploading(false);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Invalid file type. Please select an image');
        setIsUploading(false);
        return;
      }

      // Create a new reader and set up error handling
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const imageData = event.target?.result as string;
          if (!imageData) throw new Error('Failed to read image data');

          // Create an image element to check if the image is valid
          const img = new Image();
          img.onload = () => {
            // Update local state
            setImage(imageData);

            // Set both input and output image in the store
            setNodeInputImage(id as string, imageData);
            setNodeOutputImage(id as string, imageData);

            // Trigger flow processing to propagate the image to connected nodes
            setTimeout(() => {
              processFlow([], []);
            }, 100);
            setIsUploading(false);
          };

          img.onerror = () => {
            setImageError('Invalid image format');
            setIsUploading(false);
          };

          img.src = imageData;
        } catch (err) {
          console.error('Error processing image:', err);
          setImageError('Failed to process the image');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setImageError('Error reading file');
        setIsUploading(false);
      };

      // Start reading the file
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error in image upload:', err);
      setImageError('An error occurred while uploading');
      setIsUploading(false);
    }
  };

  // Reset the image
  const handleReset = () => {
    setImage(null);
    setNodeInputImage(id as string, null);
    setNodeOutputImage(id as string, null);

    // Trigger flow processing to update connected nodes
    setTimeout(() => {
      processFlow([], []);
    }, 100);
  };

  // Load node parameters only once when the component mounts or when the id changes
  useEffect(() => {
    // Adding a small delay to ensure store is initialized
    const fetchParams = () => {
      const params = getNodeParameters(id as string);
      if (params) {
        setParameters(params);
      }
    };

    fetchParams();
  }, [id]); // Remove getNodeParameters from dependencies

  // Check for output image from the store
  useEffect(() => {
    const checkOutputImage = () => {
      const outputImage = getNodeOutputImage(id as string);
      if (outputImage && outputImage !== image) {
        setImage(outputImage);
      }
    };

    // Set up an interval to check for output changes
    const intervalId = setInterval(checkOutputImage, 100);
    checkOutputImage(); // Check immediately as well

    return () => clearInterval(intervalId);
  }, [id, image]); // Remove getNodeOutputImage from dependencies

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: number | boolean | string) => {
    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      updateNodeParameter(id as string, paramName, value);
    }, 0);
  };

  // Create input section content
  const inputSectionContent = (
    <div className="bg-gray-50 rounded-md overflow-hidden relative">
      <div className="w-full flex flex-col items-center justify-center p-4 text-center gap-2">
        {imageError && (
          <div className="text-red-500 text-xs bg-red-50 p-2 rounded w-full mb-2">
            {imageError}
          </div>
        )}

        <button
          className="cursor-pointer bg-[#83AFC9] text-white px-4 py-3 rounded-md hover:bg-[#6d97b3] transition-colors w-full flex items-center justify-center gap-2"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <TbRefresh className="animate-spin" size={18} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <BiImageAdd size={20} />
              <span>Choose Image</span>
            </>
          )}
        </button>

        {/* Hidden file input - triggered by button */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          onClick={(e) => e.stopPropagation()}
        />

        <p className="text-xs text-gray-500">
          Max 5MB - JPG, PNG, GIF supported
        </p>
      </div>
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
        <img
          src={image}
          alt="Input"
          className="w-full h-auto rounded border border-gray-200 max-h-24 object-cover"
          onError={(e) => {
            console.error('Image failed to load');
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
          }}
        />
      </div>
    ) : (
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
        No image uploaded
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
      icon={<FaImage size={16} />}
      type="imageInput"
      selected={selected}
      nodeRight={nodeRight}
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
