import {
  FcRadarPlot,
  FcStackOfPhotos,
  FcCollect,
  FcOrgUnit,
} from "react-icons/fc";

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
        <h1 className="text-4xl md:text-7xl font-semibold mb-4 md:mb-16 text-start">
          AI PLAYGROUND
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {menu_items.map((item, index) => (
            <div
              className="flex flex-row items-center gap-2 md:gap-6 hover:scale-105 duration-250 ease-soft-spring"
              key={index}
            >
              <div className="p-2 md:p-4 bg-white rounded-full shadow-lg">
                {item.icon}
              </div>
              <h2 className="text-md md:text-xl font-medium">
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
