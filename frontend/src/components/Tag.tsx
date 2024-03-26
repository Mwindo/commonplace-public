import { Link } from "react-router-dom";
import classes from "./Tag.module.css";

function Tag({ tag }: { tag: string }) {
  return (
    // The tag will link to the ItemSearch page and pass along the tag as a query param
    // The ItemSearch page can take in that param and use it to set the selected tag
    <Link
      role="link"
      aria-label="See other articles with same tag"
      className={classes.tag_link}
      to={`/?tagsearch=${tag}`}
    >
      {tag}
    </Link>
  );
}

export default Tag;
