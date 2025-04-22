import React, { useState } from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { IoSearch, IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { FaCode, FaImage, FaSort, FaMagic } from "react-icons/fa";
import { MdInfo, MdSupport } from "react-icons/md";
import Link from "next/link";
import menuItems from "@/data/component_items/TopMenuDropItems.json";

interface TreeItem {
  name: string;
  link?: string;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: TreeItem[];
}

// Utility to filter tree data based on search query
const filterTree = (items: TreeItem[], query: string): TreeItem[] => {
  if (!query) return items;

  return items
    .map((item) => {
      const match =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.children && filterTree(item.children, query).length > 0);
      if (!match) return null;

      return {
        ...item,
        children: item.children ? filterTree(item.children, query) : undefined,
      };
    })
    .filter(Boolean) as TreeItem[];
};

// Highlight matches in the name
const HighlightText: React.FC<{ text: string; query: string }> = ({
  text,
  query,
}) => {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// Category Icons Mapping
const categoryIcons: { [key: string]: JSX.Element } = {
  Algorithms: <FaCode className="text-blue-500" size={20} />,
  "Image processing": <FaImage className="text-green-500" size={20} />,
  information: <IoInformationCircleOutline className="text-purple-500" size={20} />,
};

// Child Icons Mapping
const childIcons: { [key: string]: JSX.Element } = {
  Sorting: <FaSort className="text-blue-500" size={16} />,
  "Image Convolution": <FaImage className="text-green-500" size={16} />,
  "Image Enchanted": <FaMagic className="text-green-500" size={16} />,
  "About Us": <MdInfo className="text-purple-500" size={16} />,
  Support: <MdSupport className="text-purple-500" size={16} />,
};

// Child Tree Component (for nested items)
const ChildTree: React.FC<{
  item: TreeItem;
  searchQuery: string;
}> = ({ item, searchQuery }) => {
  const [isOpen, setOpen] = useState(item.defaultOpen || false);
  const [ref, { height: viewHeight }] = useMeasure();

  const { height, opacity, y } = useSpring({
    from: { height: 10, opacity: 0, y: 10 },
    to: {
      height: isOpen ? viewHeight + 10 : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 10,
    },
    config: { tension: 280, friction: 20 },
  });

  const icon = childIcons[item.name] || <FaCode className="text-gray-500" size={16} />;

  return (
    <div >
      <div
        className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-blue-50 cursor-pointer ${
          item.children ? "border-b border-gray-100" : ""
        }`}
        onClick={() => item.children && setOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && item.children && setOpen(!isOpen)}
        role={item.children ? "button" : "link"}
        aria-expanded={item.children ? isOpen : undefined}
        tabIndex={0}
      >
        {icon}
        {item.link ? (
          <Link href={item.link} className="flex-1">
            <span className="text-gray-800 text-sm font-medium hover:text-blue-600 transition-colors duration-200">
              <HighlightText text={item.name} query={searchQuery} />
            </span>
          </Link>
        ) : (
          <span className="text-gray-800 text-sm font-medium flex-1">
            <HighlightText text={item.name} query={searchQuery} />
          </span>
        )}
      </div>
      {item.children && (
        <a.div
          style={{ height, opacity, overflow: "hidden" }}
          className="mt-1"
        >
          <div ref={ref} style={{ transform: `translateY(${y}px)` }}>
            {item.children.map((child, index) => (
              <ChildTree key={index} item={child} searchQuery={searchQuery} />
            ))}
          </div>
        </a.div>
      )}
    </div>
  );
};

// Note: CategoryCard component is no longer used in the new sectioned layout

// Main Component
const DropdownTree: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter only the children of "All content" for the grid
  const allContent = menuItems.find((item) => item.name === "All content");
  const gridItems = allContent?.children || [];

  // Filtered tree items
  const filteredItems = filterTree(gridItems, searchQuery);

  return (
    <div className="">
      <div className="relative mb-4">
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white shadow-sm"
          aria-label="Search categories"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>
      {filteredItems.length === 0 && searchQuery ? (
        <p className="text-center text-gray-500 text-sm py-4">No results found</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Section Grid Layout */}
          {filteredItems.map((category, index) => (
            <section key={index} className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                {categoryIcons[category.name] || <FaCode className="text-gray-500" size={24} />}
                <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
              </div>
              
              {/* Grid of Category Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {category.children?.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-all duration-200">
                    <ChildTree item={item} searchQuery={searchQuery} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTree;