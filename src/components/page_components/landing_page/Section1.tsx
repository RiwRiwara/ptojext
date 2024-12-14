import {
  FcRadarPlot,
  FcStackOfPhotos,
  FcCollect,
  FcOrgUnit,
} from "react-icons/fc";
import Image from "next/image";

const menu_items = [
  {
    name: "Reinforcement Learning",
    description: "Learn about Reinforcement Learning",
    icon: <FcCollect className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Image processing",
    description: "Learn about Image processing",
    icon: <FcStackOfPhotos className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Data Structure and Algorithms",
    description: "Learn about Data Structure and Algorithms",
    icon: <FcOrgUnit className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Neural Network",
    description: "Learn about Neural Network",
    icon: <FcRadarPlot className="w-6 h-6 md:w-10 md:h-10" />,
  },
];

export default function Section1() {
  return (
    <main className="h-screen flex items-center justify-center md:-mt-24 -mt-44">
      <div className="text-start">
        <h1 className="hidden">VISUALRIGHT</h1>
        <h2 className="text-4xl md:text-7xl font-medium mb-4 md:mb-16 text-start flex flex-col md:flex-row gap-6 md:gap-10 items-center">
          <Image
            className="ease-soft-spring animate-appearance-in"
            src="/logo/logo-full.png"
            width={100}
            height={100}
            alt="VISUALRIGHT logo"
          />
          <div>
            <span className="text-stone-500 flex flex-row gap-1 animate-appearance-in">
              {["V", "I", "S", "U", "A", "L", "R", "I", "G", "H", "T"].map(
                (letter, index) => (
                  <span
                    key={index}
                    className={`hover:text-stone-700  duration-400 hover:text-8xl ease-soft-spring cursor-default `}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationIterationCount: "infinite",
                    }}
                  >
                    {letter}
                  </span>
                )
              )}
            </span>
          </div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {menu_items.map((item, index) => (
            <div
              className="flex flex-row items-center gap-2 md:gap-6 hover:scale-105 duration-250 ease-soft-spring animate-appearance-in"
              key={index}
            >
              <div className="p-2 md:p-4 bg-white rounded-full shadow-lg">
                {item.icon}
              </div>
              <h2 className="text-md md:text-xl font-medium text-stone-500">
                {/* render html string*/}
                <span dangerouslySetInnerHTML={{ __html: item.name }} />
              </h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
