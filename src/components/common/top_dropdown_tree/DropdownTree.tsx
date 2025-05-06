import React, { useState, memo } from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { IoSearch, IoClose, IoInformationCircleOutline, IoChevronDown } from "react-icons/io5";
import { FaCode, FaImage, FaSort, FaMagic, FaSearch } from "react-icons/fa";
import { MdInfo, MdSupport } from "react-icons/md";
import Link from "next/link";
import menuItems from "@/data/component_items/TopMenuDropItems.json";
import { FcSearch } from "react-icons/fc";

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
HighlightText.displayName = "HighlightText"; // Add displayName

// Category Icons Mapping
const categoryIcons: { [key: string]: JSX.Element } = {
  Algorithms: <FaCode className="text-blue-500" size={20} />,
  "Image processing": <FaImage className="text-green-500" size={20} />,

  information: <IoInformationCircleOutline className="text-purple-500" size={20} />,
};

// Child Icons Mapping
const childIcons: { [key: string]: JSX.Element } = {
  Sorting: <FaSort className="text-blue-500" size={16} />,
  Search: <FaSearch className="text-blue-500" size={16} />,
  "Image Convolution": <FaImage className="text-green-500" size={16} />,
  "Image Enhancement": <FaMagic className="text-green-500" size={16} />,
  "About Us": <MdInfo className="text-purple-500" size={16} />,
  Support: <MdSupport className="text-purple-500" size={16} />,
};

// Child Tree Component (for nested items) - using memo for better performance
const ChildTree: React.FC<{
  item: TreeItem;
  searchQuery: string;
}> = memo(({ item, searchQuery }) => {
  const [isOpen, setOpen] = useState(item.defaultOpen || false);
  const [ref, { height: viewHeight }] = useMeasure();

  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
    },
    config: { tension: 300, friction: 26 },
  });

  // Get icon based on item name
  const icon = childIcons[item.name] || <FaCode className="text-gray-500" size={14} />;

  // Link or button layout
  const content = (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-md transition-all hover:bg-blue-50 cursor-pointer`}
      onClick={() => item.children && setOpen(!isOpen)}
      onKeyDown={(e) => e.key === "Enter" && item.children && setOpen(!isOpen)}
      role={item.children ? "button" : "link"}
      aria-expanded={item.children ? isOpen : undefined}
      tabIndex={0}
    >
      {icon}
      {item.link ? (
        <Link href={item.link} className="flex-1">
          <span className="text-gray-700 text-xs hover:text-blue-600 transition-colors">
            <HighlightText text={item.name} query={searchQuery} />
          </span>
        </Link>
      ) : (
        <span className="text-gray-700 text-xs flex-1">
          <HighlightText text={item.name} query={searchQuery} />
        </span>
      )}
      {item.children && (
        <IoChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          size={14}
        />
      )}
    </div>
  );

  return (
    <div className="py-0.5">
      {content}
      {item.children && (
        <a.div
          style={{ height, opacity, overflow: "hidden" }}
          className="pl-4"
        >
          <div ref={ref}>
            {item.children.map((child, index) => (
              <ChildTree key={index} item={child} searchQuery={searchQuery} />
            ))}
          </div>
        </a.div>
      )}
    </div>
  );
});
ChildTree.displayName = "ChildTree"; // Explicitly set for clarity

// Main Component - more compact and performance optimized
const DropdownTree: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter only the children of "All content" for the grid
  const allContent = menuItems.find((item) => item.name === "All content");
  const gridItems = allContent?.children || [];

  // Filtered tree items
  const filteredItems = filterTree(gridItems, searchQuery);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Compact search input */}
      <div className="relative mb-3">
        <IoSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm"
          aria-label="Search categories"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <IoClose size={16} />
          </button>
        )}
      </div>

      {/* No results message */}
      {filteredItems.length === 0 && searchQuery ? (
        <p className="text-center text-gray-500 text-xs py-2">No results found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* More compact section layout */}
          {filteredItems.map((category, index) => (
            <section key={index} className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
              {/* Compact section header */}
              <div className="flex items-center gap-2 mb-2">
                {categoryIcons[category.name] || <FaCode className="text-gray-500" size={18} />}
                <h2 className="text-base font-semibold text-gray-800">{category.name}</h2>
              </div>

              {/* Grid of Category Items - more compact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {category.children?.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white rounded-md shadow-sm p-2 hover:shadow transition-all duration-200">
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