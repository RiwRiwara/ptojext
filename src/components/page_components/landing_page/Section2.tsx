"use client";
import { motion, AnimationControls } from "framer-motion";
import '@/utils/i18n.config';
import { useTranslation } from "react-i18next";

interface Section2Props {
  controls: AnimationControls;
}

export default function Section2({ controls }: Section2Props) {
  const { t } = useTranslation('common');

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    pageLoad: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100 ">
      <motion.div
        className="text-center"
        initial="hidden"
        variants={fadeInVariants}
        animate={controls ? controls : "pageLoad"}
      >
        <h2 className="text-5xl font-bold mb-4">{t("LSECTION2")}</h2>
        <p className="text-lg">Scroll down to explore more.</p>
      </motion.div>
    </section>
  );
}
