import Tag from "./Tag";
import classes from "./TagBox.module.css";

function TagBox(props) {
  return (
    <div role="list" className={classes.tag_box_container}>
      {props.tags &&
        props.tags.map((x) => (
          <div key={x} role="listitem">
            <Tag tag={x} />
          </div>
        ))}
    </div>
  );
}

export default TagBox;
