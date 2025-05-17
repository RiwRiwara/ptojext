"use client";

import { useRef } from "react";
import { FiUpload, FiImage } from "react-icons/fi";
import { Button, Card, CardHeader, CardBody } from "@heroui/react";

interface UploadImageProps {
  onImageUpload: (imageSrc: string) => void;
  title?: string;
}

export default function UploadImage({
  onImageUpload,
  title = "Upload Image",
}: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        </CardHeader>
        <CardBody className="py-4 flex flex-col items-center justify-center gap-4">
          <Button
            color="primary"
            onPress={() => fileInputRef.current?.click()}
            startContent={<FiUpload />}
          >
            Upload Image
          </Button>

          <div className="w-full border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center text-gray-400">
            <FiImage size={48} />
            <p className="mt-2 text-sm">Upload an image to apply your filter</p>
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </CardBody>
      </Card>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        onClick={(e) => (e.currentTarget.value = "")}
      />
    </>
  );
}
