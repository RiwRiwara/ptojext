"use client";
import React, { useState, useEffect } from "react";
import CanvasGridRenderImage from "./partials/CanvasGridRenderImage";
import CanvasGridRendererAnimateInput from "./partials/CanvasGridRendererAnimateInput";
import CanvasGridConvolution from "./partials/CanvasGridConvolution";
import CanvasGridResult from "./partials/CanvasGridResult";
import ImageUploader from "./partials/ImageUploader";
import useStore from "./state/store";
import "@/utils/i18n.config";
import { useTranslation } from "react-i18next";

export default function ImageConvolutionMap() {
  const { t } = useTranslation("imageprocessing");
  const { gridState, convolutionOutput, hoverPosition, gridConvolutionManager } = useStore();

  return (
    <div className="w-full flex justify-center max-w-[1200px] mx-auto flex-col gap-6 p-4">
      {/* ================= Section 1 ================= */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t("whatisimageconvolution")}
          </h1>
          <p className="text-lg">{t("mean")}</p>
        </div>
      </div>

      {/* ================= Section 2 ================= */}
      <div className="flex flex-col justify-center items-center gap-4">
        <CanvasGridRenderImage
          initialRows={40}
          initialCols={40}
          initialCellSize={10}
          image="https://visualright.blob.core.windows.net/images/image_3.jpeg"
          isGridLine={true}
        />
        <div className="text-lg">{t("mean_sub")}</div>
      </div>

      {/* ================= Section 3 ================= */}
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Interactive Convolution Matrix ({gridState.rows} x {gridState.cols})
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Hover over the input grid to perform convolution. Edit the kernel values by clicking on them.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start justify-center">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-800">Input Grid</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => gridConvolutionManager.scaleUpGrids()}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-600 text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                  aria-label="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => gridConvolutionManager.scaleDownGrids()}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                  aria-label="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div className=" max-h-64">
            <CanvasGridRendererAnimateInput />
          <div className="text-center text-sm text-gray-600 mt-2">
            {hoverPosition ? 
              `Selected position: (${hoverPosition.row}, ${hoverPosition.col})` : 
              'Hover over grid to perform convolution'}
          </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-center text-gray-800">Convolution Kernel</h2>
          <CanvasGridConvolution />
          <div className="text-center text-sm text-gray-600 mt-2">
            Click on kernel values to edit them
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-center text-gray-800">Result</h2>
          <CanvasGridResult />
          <div className="text-center text-sm text-gray-600 mt-2">
            Output value: <span className="font-medium">{convolutionOutput}</span>
          </div>
        </div>
      </div>
      
      {/* New section for user image uploads */}
      <div className="my-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Try with Your Own Image</h2>
        <div className="max-w-4xl mx-auto">
          <ImageUploader />
        </div>
      </div>
    </div>
  );
}