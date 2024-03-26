import Tagg from "./Tag";
import classes from "./TagBox.module.css";

function TagBox({ tags }: { tags: string[] }) {
  return (
    <div role="list" className={classes.tag_box_container}>
      {tags &&
        tags.map((x) => (
          <div key={x} role="listitem">
            <Tagg tag={x} />
          </div>
        ))}
    </div>
  );
}

export default TagBox;
