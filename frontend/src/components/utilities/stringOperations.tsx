import { Fragment } from "react";
import { Text } from "domhandler/lib/node";
import parse from "html-react-parser";
import styles from "../../styling/TextStyles.module.css";

// Return a component that renders line breaks
export function MakeSplitStringComponent(text: string) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {formatLine(line)}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

const formatLine = (line: string) => {
  return parse(line, {
    replace(domNode) {
      if (domNode.type === "tag") {
        switch (domNode.name) {
          case "quote":
            return (
              <div className={styles.quotation}>
                {domNode.children.map((child) => (child as Text).data)}
              </div>
            );
          case "quote_attribution":
            return (
              <div className={styles.quotation}>
                --{domNode.children.map((child) => (child as Text).data)}
              </div>
            );
          case "a":
            return (
              <a className={styles.text_link} href={domNode.attribs.href}>
                {domNode.children.map((child) => (child as Text).data)}
              </a>
            );
          default:
            break;
        }
      }
    },
  });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
