import React from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { TbPlus, TbMinus } from "react-icons/tb";
import Link from "next/link";
import { Container, Title, Frame, Content, ToggleIcon } from "./styles";
import menuItems from "@/data/component_items/TopMenuDropItems.json";

// Hook to remember the previous state
function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// Tree Component
const Tree: React.FC<{
  name: string | JSX.Element;
  link?: string;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ children, name, link, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = React.useState(defaultOpen);
  const previous = usePrevious(isOpen);
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
    <Frame>
      <ToggleIcon
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!isOpen)}
      >
        <Icon style={{ opacity: children ? 1 : 0.3 }} />
      </ToggleIcon>
      {link ? (
        <Link href={link}>
          <Title style={style}>{name}</Title>
        </Link>
      ) : (
        <Title style={style}>{name}</Title>
      )}
      <Content
        style={{
          height: isOpen && previous === isOpen ? "auto" : height,
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

// Recursive Rendering Function
const renderTree = (
  items: {
    name: string;
    link?: string;
    defaultOpen?: boolean;
    style?: React.CSSProperties;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any[];
  }[]
) => {
  return items.map((item, index) => (
    <Tree
      key={index}
      name={item.name}
      link={item.link}
      defaultOpen={item.defaultOpen}
      style={item.style}
    >
      {item.children && renderTree(item.children)}
    </Tree>
  ));
};

// Main Component
const DropdownTree: React.FC = () => {
  return <Container>{renderTree(menuItems)}</Container>;
};

export default DropdownTree;
