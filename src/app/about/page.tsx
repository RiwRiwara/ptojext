"use client";
import CommonLayout from "@/components/layout/CommonLayout";
import { motion } from "framer-motion";

export default function About() {
  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };
  return (
    <CommonLayout>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className=" flex flex-col justify-start h-full gap-8">
          <div className="max-h-[90vh] flex flex-col container mx-auto  max-w-[600px] bg-gradient-to-b from-slate-600 to-gray-400 rounded-[20px] rounded-t-[45px] p-4 text-white border-2 border-white shadow-lg shadow-gray-300">

            {/* Content */}
            <h1 className="uppercase text-3xl font-bold mb-3">About</h1>
            <div className="uppercase text-lg cus-scroll overflow-auto">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed
              asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Sed asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? mollitia distinctio excepturi optio voluptas repellat a
              quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur amet nemo ab consectetur mollitia distinctio excepturi
              optio consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Sed asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? mollitia distinctio excepturi optio voluptas repellat a
              quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur amet nemo ab consectetur mollitia distinctio excepturi
              optio consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Sed asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? mollitia distinctio excepturi optio voluptas repellat a
              quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur amet nemo ab consectetur mollitia distinctio excepturi
              optio
            </div>
            {/* COntent */}
          </div>
        </div>
      </motion.div>
    </CommonLayout>
  );
}
