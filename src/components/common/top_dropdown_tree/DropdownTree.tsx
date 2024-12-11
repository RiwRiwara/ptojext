import React, { useState } from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { TbPlus, TbMinus } from "react-icons/tb";
import Link from "next/link";
import { IoNavigate } from "react-icons/io5";
import {
  Container,
  Title,
  Frame,
  Content,
  ToggleIcon,
  SearchInput,
} from "./styles"; 
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
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// Tree Component
const Tree: React.FC<{
  name: string | JSX.Element;
  link?: string;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  searchQuery: string;
}> = ({
  children,
  name,
  link,
  style,
  defaultOpen = false,
  className,
  searchQuery,
}) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const [ref, { height: viewHeight }] = useMeasure();

  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 20 },
    to: {
      height: isOpen ? viewHeight + 10 : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  });

  const Icon = isOpen ? TbMinus : TbPlus;

  return (
    <Frame className={className}>
      <ToggleIcon
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!isOpen)}
      >
        {children ? (
          <Icon style={{ opacity: 1 }} />
        ) : (
          <IoNavigate style={{ opacity: 1 }} />
        )}
      </ToggleIcon>
      {link ? (
        <Link href={link}>
          <Title style={style} className="tree-link text-blue-500 italic">
            {typeof name === "string" ? (
              <HighlightText text={name} query={searchQuery} />
            ) : (
              name
            )}
          </Title>
        </Link>
      ) : (
        <Title style={style} className="tree-title">
          {typeof name === "string" ? (
            <HighlightText text={name} query={searchQuery} />
          ) : (
            name
          )}
        </Title>
      )}
      <Content
        style={{
          height: isOpen ? "auto" : height,
          opacity,
        }}
      >
        <a.div ref={ref} style={{ y }}>
          {children}
        </a.div>
      </Content>
    </Frame>
  );
};

// Recursive rendering function
const renderTree = (
  items: TreeItem[],
  searchQuery: string
): React.ReactNode => {
  return items.map((item, index) => (
    <Tree
      key={index}
      name={item.name}
      link={item.link}
      defaultOpen={item.defaultOpen}
      style={item.style}
      className={item.className}
      searchQuery={searchQuery}
    >
      {item.children && renderTree(item.children, searchQuery)}
    </Tree>
  ));
};

// Main Component
const DropdownTree: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered tree items
  const filteredItems = filterTree(menuItems, searchQuery);

  return (
    <Container>
      <div className="flex flex-col gap-1">
        <SearchInput
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        {renderTree(filteredItems, searchQuery)}
      </div>
    </Container>
  );
};

export default DropdownTree;
