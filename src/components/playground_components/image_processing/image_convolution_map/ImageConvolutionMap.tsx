"use client";
import React, { useState } from "react";
import CanvasGridRenderImage from "./partials/CanvasGridRenderImage";
import CanvasGridRendererAnimateInput from "./partials/CanvasGridRendererAnimateInput";
import CanvasGridConvolution from "./partials/CanvasGridConvolution";
import CanvasGridResult from "./partials/CanvasGridResult";
import ImageUploader from "./partials/ImageUploader";
import useStore from "./state/store";
import "@/utils/i18n.config";
import { useTranslation } from "react-i18next";
import { TbZoomIn, TbZoomOut, TbInfoCircle } from "react-icons/tb";

export default function ImageConvolutionMap() {
  const { t } = useTranslation("imageprocessing");
  const {
    gridState,
    convolutionOutput,
    hoverPosition,
    gridConvolutionManager,
  } = useStore();

  return (
    <div
    // className="w-full flex flex-col justify-center mx-auto gap-8"
    // className="grid grid-cols-1 md:grid-cols-2 gap-6"
    className="flex flex-col md:flex-row gap-6 justify-center mx-auto"
    >
      {/* Section 1: Introduction */}
      <div className="w-full md:w-1/4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-blue-50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 h-6 w-1 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {t("whatisimageconvolution")}
            </h2>
          </div>
          <p className="text-sm text-gray-700">{t("mean")}</p>
        </div>

        <div className="p-6 flex flex-col gap-6 items-center flex-wrap">
          <div className="flex-1 flex justify-center">
            <CanvasGridRenderImage
              initialRows={40}
              initialCols={40}
              initialCellSize={8}
              image="https://visualright.blob.core.windows.net/images/image_3.jpeg"
              isGridLine={true}
            />
          </div>
          <div className="flex-1">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-800 mb-2">Key Concept</h3>
              <p className="text-sm text-gray-700">{t("mean_sub")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Playground & Section 3: Try Your Own Image */}
      <div className="w-full md:w-3/4 grid grid-rows-1 md:grid-rows-1 gap-4">
        <div className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-purple-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 h-6 w-1 rounded-full"></div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                  Interactive Convolution Matrix
                </h2>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Explore how convolution works by interacting with a{" "}
              {gridState.rows} x {gridState.cols} matrix.
            </p>
            <p className="text-sm text-gray-700 mt-3">
              Hover over the input grid to see convolution in action. Click on
              kernel values to edit them.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Grid Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Input Grid
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => gridConvolutionManager.scaleUpGrids()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-medium hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                    aria-label="Zoom In"
                  >
                    <TbZoomIn size={18} />
                  </button>
                  <button
                    onClick={() => gridConvolutionManager.scaleDownGrids()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white font-medium hover:bg-gray-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                    aria-label="Zoom Out"
                  >
                    <TbZoomOut size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-center">
                <CanvasGridRendererAnimateInput />
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded-lg text-center text-sm text-gray-700 border-l-4 border-blue-400">
                {hoverPosition
                  ? `Selected position: (${hoverPosition.row}, ${hoverPosition.col})`
                  : "Hover over grid to perform convolution"}
              </div>
            </div>

            {/* Convolution Kernel Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                Convolution Kernel
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-center">
                <CanvasGridConvolution />
              </div>
              <div className="mt-3 p-2 bg-purple-50 rounded-lg text-center text-sm text-gray-700 border-l-4 border-purple-400">
                Click on kernel values to edit them
              </div>
            </div>

            {/* Result Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                Result
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-center">
                <CanvasGridResult />
              </div>
              <div className="mt-3 p-2 bg-green-50 rounded-lg text-center text-sm text-gray-700 border-l-4 border-green-400">
                Output value:{" "}
                <span className="font-medium">{convolutionOutput}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
          <div className="bg-green-50 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 h-6 w-1 rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Try with Your Own Image
              </h2>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Upload your own image to see how convolution affects it.
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
              <ImageUploader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
