"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import '@/utils/i18n.config';
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation("common");
  const changeLanguageBox = () => {
    const nextLanguage = i18n.language === "th" ? "en" : "th";
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <BaseLayout>
      <div>


        <div className="flex flex-col justify-start h-full gap-8">
          <div className="max-h-[90vh] flex flex-col container mx-auto max-w-[600px]  rounded-md  p-4 text-gray-600 border-2 border-white shadow-md shadow-gray-300">
            <div className="w-full flex flex-row justify-between">

              <h1 className="uppercase text-3xl font-bold mb-3">
                {t("ABOUT_TITLE")}
              </h1>

              <a
                onClick={changeLanguageBox}
                className="cursor-pointer text-black-600 hover:underline"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="text-sm-bold">
                    {i18n.language === "en" ? "ENG" : "ไทย"}
                  </div>
                </div>
              </a>
            </div>

            <div className="uppercase text-lg cus-scroll overflow-auto">
              {t("ABOUT_US")}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
