import { Fragment } from "react";

// Return a component that renders line breaks
export function MakeSplitStringComponent(text) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
