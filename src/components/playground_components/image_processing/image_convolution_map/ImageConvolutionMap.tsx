"use client";
import React, { useState, useEffect } from "react";
import CanvasGridRenderImage from "./partials/CanvasGridRenderImage";
import CanvasGridRendererAnimateInput from "./partials/CanvasGridRendererAnimateInput";
import CanvasGridConvolution from "./partials/CanvasGridConvolution";
import useStore from "./state/store";
import '@/utils/i18n.config';
import { useTranslation } from "react-i18next";


export default function ImageConvolutionMap() {
  const { t } = useTranslation('imageprocessing');
  const { convolutionData, gridState } = useStore();

  return (
    <div className="w-full flex justify-center max-w-[1000px] mx-auto flex-col gap-6 p-4">
      {/* ================= Section 1 ================= */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t("whatisimageconvolution")}
          </h1>
          <p className="text-lg">
            {t("mean")}
          </p>
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
        <div className="text-lg">
          {t("mean_sub")}
        </div>
      </div>


      {/* ================= Section 3 ================= */}
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Now we have matrix {gridState.rows} x {gridState.rows}
        </h1>
      </div>

      <div className="flex flex-row gap-6 items-center justify-center">
        <div>
          <CanvasGridRendererAnimateInput
          />
        </div>

        <div>
          <CanvasGridConvolution />
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}
