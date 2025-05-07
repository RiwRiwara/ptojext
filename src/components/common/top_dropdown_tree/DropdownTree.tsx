import React, { useState, memo, useCallback, useMemo } from "react";
import { useSpring, a, config } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { IoSearch, IoClose, IoChevronDown } from "react-icons/io5";
import { FaCode, FaImage, FaSort, FaMagic, FaSearch, FaChartBar, FaGamepad } from "react-icons/fa";
import { MdInfo, MdSupport, MdOutlineCategory } from "react-icons/md";
import { TbBrain, TbMathFunction } from "react-icons/tb";
import { AiOutlineRobot } from "react-icons/ai";
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

  const normalizedQuery = query.toLowerCase().trim();

  return items
    .map((item) => {
      const match =
        item.name.toLowerCase().includes(normalizedQuery) ||
        (item.children && filterTree(item.children, normalizedQuery).length > 0);
      if (!match) return null;

      return {
        ...item,
        children: item.children ? filterTree(item.children, normalizedQuery) : undefined,
      };
    })
    .filter(Boolean) as TreeItem[];
};

// Highlight matches in the name with a more subtle and modern highlight
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
          <span key={index} className="bg-blue-100 text-blue-800 rounded px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};
HighlightText.displayName = "HighlightText";

// Enhanced Category Icons Mapping with more icons and consistent styling
const categoryIcons: { [key: string]: JSX.Element } = {
  Algorithms: <AiOutlineRobot className="text-blue-600" size={22} />,
  "Image processing": <FaImage className="text-emerald-600" size={20} />,
  Visualization: <FaChartBar className="text-indigo-600" size={20} />,
  Playground: <FaGamepad className="text-purple-600" size={20} />,
  Simulations: <TbBrain className="text-rose-600" size={22} />,
  information: <MdInfo className="text-amber-600" size={20} />,
  "All content": <MdOutlineCategory className="text-blue-600" size={22} />,
};

// Enhanced Child Icons Mapping with more icons and consistent styling
const childIcons: { [key: string]: JSX.Element } = {
  Sorting: <FaSort className="text-blue-500" size={18} />,
  Search: <FaSearch className="text-blue-500" size={18} />,
  "Image Convolution": <FaImage className="text-emerald-500" size={18} />,
  "Image Enhancement": <FaMagic className="text-emerald-500" size={18} />,
  "Image Processing Quiz": <FaGamepad className="text-emerald-500" size={18} />,
  "About Us": <MdInfo className="text-amber-500" size={18} />,
  Support: <MdSupport className="text-amber-500" size={18} />,
  Pathfinding: <TbMathFunction className="text-purple-500" size={18} />,
};

// Child Tree Component - enhanced with better animations and styling
const ChildTree: React.FC<{
  item: TreeItem;
  searchQuery: string;
  depth?: number;
}> = memo(({ item, searchQuery, depth = 0 }) => {
  const [isOpen, setOpen] = useState(item.defaultOpen || false);
  const [ref, { height: viewHeight }] = useMeasure();
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced spring animation with better physics
  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
    },
    config: config.gentle,
  });

  // Get icon based on item name with fallback based on depth
  const icon = childIcons[item.name] ||
    (depth === 0 ? <FaCode className="text-blue-500" size={18} /> :
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-1"></div>);

  // Determine if this is a leaf node (no children)
  const isLeaf = !item.children || item.children.length === 0;

  // Handle click with proper toggling
  const handleClick = useCallback(() => {
    if (item.children && item.children.length > 0) {
      setOpen(!isOpen);
    }
  }, [item.children, isOpen]);

  // Enhanced content with better hover effects and accessibility
  const content = (
    <div
      className={`flex items-center gap-2 p-2 rounded-md transition-all ${isLeaf ? 'hover:bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer ${isHovered ? 'shadow-sm' : ''}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={item.children ? "button" : "link"}
      aria-expanded={item.children ? isOpen : undefined}
      tabIndex={0}
    >
      <div className="flex-shrink-0">{icon}</div>

      {item.link ? (
        <Link href={item.link} className="flex-1">
          <span className={`text-gray-700 font-medium text-sm hover:text-blue-600 transition-colors ${isHovered ? 'text-blue-600' : ''}`}>
            <HighlightText text={item.name} query={searchQuery} />
          </span>
        </Link>
      ) : (
        <span className={`text-gray-700 font-medium text-sm flex-1 ${isHovered && !isLeaf ? 'text-blue-600' : ''}`}>
          <HighlightText text={item.name} query={searchQuery} />
        </span>
      )}

      {item.children && item.children.length > 0 && (
        <div
          className="flex-shrink-0"
        >
          <IoChevronDown className="text-gray-400" size={16} />
        </div>
      )}
    </div>
  );

  return (
    <div className={`py-0.5 ${depth > 0 ? 'border-l border-gray-100' : ''}`}>
      {content}
      {item.children && item.children.length > 0 && (
        <a.div
          style={{ height, opacity }}
          className={`overflow-hidden ${depth > 0 ? 'ml-3' : 'ml-4'}`}
        >
          <div ref={ref} className="pt-1">
            {item.children.map((child, index) => (
              <ChildTree
                key={index}
                item={child}
                searchQuery={searchQuery}
                depth={depth + 1}
              />
            ))}
          </div>
        </a.div>
      )}
    </div>
  );
});
ChildTree.displayName = "ChildTree";

// Main Component - completely redesigned with modern UI and better performance
const DropdownTree: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get all content and prepare data
  const allContent = useMemo(() => {
    const content = menuItems.find((item) => item.name === "All content");
    return content?.children || [];
  }, []);

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    return filterTree(allContent, searchQuery);
  }, [allContent, searchQuery]);

  // Set initial active category if none is selected
  React.useEffect(() => {
    if (!activeCategory && filteredItems.length > 0) {
      setActiveCategory(filteredItems[0].name);
    }
  }, [activeCategory, filteredItems]);

  // Get the currently active category items
  const activeCategoryItems = useMemo(() => {
    if (!activeCategory) return [];
    const category = filteredItems.find(item => item.name === activeCategory);
    return category?.children || [];
  }, [activeCategory, filteredItems]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-[380px] max-h-[450px] overflow-hidden">
      {/* Modern search input with subtle shadow */}
      <div className="p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 bg-white shadow-sm"
            aria-label="Search menu items"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="Clear search"
            >
              <IoClose size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content area with horizontal tabs and vertical content */}
      <div className="flex flex-col h-[calc(450px-57px)]">
        {filteredItems.length === 0 && searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <IoSearch className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-medium">No results found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <>
            {/* Horizontal category tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-gray-50">
              {filteredItems.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category.name ? 'text-blue-600 border-b-2 border-blue-500 bg-white' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'}`}
                >
                  <span className="flex-shrink-0">
                    {categoryIcons[category.name] || <MdOutlineCategory className="text-gray-500" size={18} />}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Content area with active category items */}
            <div className="flex-1 overflow-y-auto p-2 ">
              <div
                key={activeCategory}
                className="grid grid-cols-1 gap-1"
              >
                {activeCategoryItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChildTree item={item} searchQuery={searchQuery} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DropdownTree;