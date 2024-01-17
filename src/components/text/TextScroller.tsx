import React, { useState, ReactNode, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";

interface TextScrollerProps {
  text: (ReactNode | string)[];
}

const TextScroller: React.FC<TextScrollerProps> = ({ text }) => {
  const [key, setKey] = useState<number>(1);
  const [displayText, setDisplayText] = useState<ReactNode | string>(text[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const scrolling = useSpring({
    from: { transform: "translate(100%,0)" },
    to: { transform: "translate(-100%,0)" },
    config: { duration: 10000 },
    reset: true,
    onRest: () => {
      const currentIndex = text.indexOf(displayText);
      if (!isHovered) {
        if (currentIndex < text.length - 1) {
          // Move to the next item
          setDisplayText(text[currentIndex + 1]);
        } else {
          // Reset to the first item when reaching the end
          setDisplayText(text[0]);
          setKey((prevKey) => prevKey + 1); // Reset animation key
        }
      }
    },
  });

  const hoverSpring = useSpring({
    to: {
      transform: "translate(0%,0)",
    },
    from: {
      transform: "translate(100%,0)",
    },
    reset: true,
    config: config.default,
  });

  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    width: "100%",
  };

  const textScrollerStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    // Reset displayText and animation when the text prop changes
    setDisplayText(text[0]);
    setKey((prevKey) => prevKey + 1);
  }, [text]);

  return (
    <div
      style={containerStyle}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <animated.div
        style={isHovered ? hoverSpring : { ...textScrollerStyle, ...scrolling }}
        key={key}
      >
        {typeof displayText === "string" ? displayText : <>{displayText}</>}
      </animated.div>
    </div>
  );
};

export default TextScroller;
