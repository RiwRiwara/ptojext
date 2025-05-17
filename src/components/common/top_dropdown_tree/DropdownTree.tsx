import React, { useState, memo, useCallback, useMemo, FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import { IoSearch, IoClose, IoChevronDown } from "react-icons/io5";
import { FaCode, FaImage, FaSort, FaMagic, FaSearch, FaChartBar, FaGamepad, FaSpinner } from "react-icons/fa";
import { MdOutlineCategory, MdInfo, MdSupport } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { TbMathFunction, TbBrain } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Highlight matches in the name
const HighlightText: FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-primary-100 text-primary-800 rounded px-0.5">
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

// Category Icons Mapping
const categoryIcons: { [key: string]: JSX.Element } = {
  Algorithms: <AiOutlineRobot className="text-primary-600" size={22} />,
  "Image processing": <FaImage className="text-emerald-600" size={20} />,
  Visualization: <FaChartBar className="text-indigo-600" size={20} />,
  Playground: <FaGamepad className="text-purple-600" size={20} />,
  Simulations: <TbBrain className="text-rose-600" size={22} />,
  information: <MdInfo className="text-sky-700" size={20} />,
  "All content": <MdOutlineCategory className="text-primary-600" size={22} />,
};

// Child Icons Mapping
const childIcons: { [key: string]: JSX.Element } = {
  Sorting: <FaSort className="text-primary-500" size={18} />,
  Search: <FaSearch className="text-primary-500" size={18} />,
  "Image Convolution": <FaImage className="text-emerald-500" size={18} />,
  "Image Enhancement": <FaMagic className="text-emerald-500" size={18} />,
  "Image Processing Quiz": <FaGamepad className="text-emerald-500" size={18} />,
  "About Us": <MdInfo className="text-sky-700" size={18} />,
  Support: <MdSupport className="text-sky-700" size={18} />,
  Pathfinding: <TbMathFunction className="text-purple-500" size={18} />,
  "Sorting Quiz": <FaGamepad className="text-primary-600" size={18} />,
  "Search Quiz": <FaGamepad className="text-primary-600" size={18} />,
};

// Child Tree Component
const ChildTree: FC<{
  item: TreeItem;
  searchQuery: string;
  depth?: number;
  onNavigate?: (link: string, itemName: string) => void;
}> = memo(({ item, searchQuery, depth = 0, onNavigate }) => {
  const [isOpen, setOpen] = useState(false);
  const [ref, { height: viewHeight }] = useMeasure();
  const [isHovered, setIsHovered] = useState(false);

  const icon = childIcons[item.name] ||
    (depth === 0 ? <FaCode className="text-primary-500" size={18} /> :
      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 ml-1"></div>);

  const isLeaf = !item.children || item.children.length === 0;

  const handleClick = useCallback(() => {
    if (item.children && item.children.length > 0) {
      setOpen(!isOpen);
    } else if (item.link && onNavigate) {
      onNavigate(item.link, item.name);
    }
  }, [item.children, item.link, item.name, isOpen, onNavigate]);

  return (
    <motion.div
      className={`py-0.5 ${depth > 0 ? 'border-l border-gray-200' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isLeaf ? 'hover:bg-primary-50' : 'hover:bg-gray-50'} cursor-pointer ${isHovered ? 'shadow-sm' : ''}`}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role={item.children ? "button" : "link"}
        aria-expanded={item.children ? isOpen : undefined}
        tabIndex={0}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex-shrink-0">{icon}</div>
        {item.link ? (
          <div className="flex-1" onClick={(e) => {
            e.stopPropagation();
            if (onNavigate && item.link) onNavigate(item.link, item.name);
          }}>
            <span className={`text-gray-700 font-medium text-sm hover:text-primary-600 transition-colors cursor-pointer ${isHovered ? 'text-primary-600' : ''}`}>
              <HighlightText text={item.name} query={searchQuery} />
            </span>
          </div>
        ) : (
          <span className={`text-gray-700 font-medium text-sm flex-1 ${isHovered && !isLeaf ? 'text-primary-600' : ''}`}>
            <HighlightText text={item.name} query={searchQuery} />
          </span>
        )}
        {item.children && item.children.length > 0 && (
          <motion.div
            className="flex-shrink-0"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoChevronDown className="text-gray-400" size={16} />
          </motion.div>
        )}
      </motion.div>
      <AnimatePresence>
        {item.children && item.children.length > 0 && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: viewHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`overflow-hidden ${depth > 0 ? 'ml-3' : 'ml-4'}`}
          >
            <div ref={ref} className="pt-1">
              {item.children.map((child, index) => (
                <ChildTree
                  key={index}
                  item={child}
                  searchQuery={searchQuery}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
ChildTree.displayName = "ChildTree";

// Main DropdownTree Component
const DropdownTree: FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string>("");

  const allContent = useMemo(() => {
    const content = menuItems.find((item) => item.name === "All content");
    return content?.children || [];
  }, []);

  const filteredItems = useMemo(() => {
    return filterTree(allContent, searchQuery);
  }, [allContent, searchQuery]);

  React.useEffect(() => {
    if (!activeCategory && filteredItems.length > 0) {
      setActiveCategory(filteredItems[0].name);
    }
  }, [activeCategory, filteredItems]);

  const activeCategoryItems = useMemo(() => {
    if (!activeCategory) return [];
    const category = filteredItems.find((item: TreeItem) => item.name === activeCategory);
    return category?.children || [];
  }, [activeCategory, filteredItems]);
  
  // Handle navigation with loading state
  const handleNavigation = useCallback((link: string, itemName: string) => {
    setIsNavigating(true);
    setNavigatingTo(itemName);
    
    // Simulate a small delay before navigation to show the loading state
    setTimeout(() => {
      router.push(link);
    }, 300);
  }, [router]);

  return (
    <motion.div
      className="w-[380px] max-h-[450px] overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaSpinner className="text-primary-500 text-2xl animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-700">Navigating to {navigatingTo}...</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" size={18} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 bg-white shadow-sm transition-all"
            aria-label="Search menu items"
          />
          {searchQuery && (
            <motion.button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="Clear search"
              whileHover={{ scale: 1.1 }}
            >
              <IoClose size={14} />
            </motion.button>
          )}
        </div>
      </div>
      <div className="flex flex-col h-[calc(450px-57px)]">
        {filteredItems.length === 0 && searchQuery ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <IoSearch className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-medium">No results found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </motion.div>
        ) : (
          <>
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gray-50">
              {filteredItems.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category.name ? 'text-primary-600 border-b-2 border-primary-500 bg-white' : 'text-gray-600 hover:text-primary-500 hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex-shrink-0">
                    {categoryIcons[category.name] || <MdOutlineCategory className="text-gray-500" size={18} />}
                  </span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-1 gap-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeCategoryItems.map((item, index) => (
                  <ChildTree
                    key={index}
                    item={item}
                    searchQuery={searchQuery}
                    onNavigate={handleNavigation}
                  />
                ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DropdownTree;