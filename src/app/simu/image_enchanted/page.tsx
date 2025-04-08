"use client";
import React from "react";

import "@xyflow/react/dist/style.css";
import {
  NoiseNode,
  ImageOriginalNode,
  ImageEnchantedNode,
  GrayScaleNode,
  SharpeningNode,
} from "@/components/image_enchanted/index";
import { Tooltip } from "@nextui-org/tooltip";
import useStore from "@/components/image_enchanted/states/store";
import BottomRight from "@/components/image_enchanted/ui/BottomRight";

import { getAllImages } from "@/components/image_enchanted/data/crud";
import { EnchantedImage } from "@/components/image_enchanted/data/types";
import Image from "next/image";
import { Link } from "@nextui-org/link";
import { FaInfoCircle } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";
import BaseLayout from "@/components/layout/BaseLayout";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tour_steps } from "@/components/image_enchanted/data/tour_steps";
import { useTranslation } from "react-i18next";
import CanvasGridRenderImage from "@/components/playground_components/image_processing/image_convolution_map/partials/CanvasGridRenderImage";
import '@/utils/i18n.config';
import EnchantedFilters from "@/components/image_enchanted/enchantedFilters";

export default function ImageEnchatedPage() {
  const { t } = useTranslation('imageenchanted');
  // const { convolutionData, gridState } = useStore();

  return (
    <BaseLayout>
    <div className="container mx-auto flex flex-col justify-start h-screen gap-8 p-2 pt-8 mb-10 ">

      <h1 className="uppercase text-3xl font-bold mt-3 text-center">Image Enchanted</h1>
      
    <div className="w-full flex justify-center max-w-[1000px] mx-auto flex-col gap-6 p-4">
      {/* ================= Section 1 ================= */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t("whatisimageenchanted")}
          </h1>
          <p className="text-lg">
            {t("mean")}
          </p>
        </div>
      </div>
      <EnchantedFilters />
    </div>

    </div>
  </BaseLayout>
  );
}