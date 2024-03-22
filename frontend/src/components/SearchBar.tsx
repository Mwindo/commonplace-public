import classes from "./SearchBar.module.css";
import Select from "react-select";
import diceIcon from "../images/dice-icon.svg";
import { useNavigate } from "react-router-dom";
import { itemCardIsAddItem } from "./utilities/itemCardUtilities";

const canRandomize = (items: any) => {
  return items.filter((item: any) => !itemCardIsAddItem(item)).length > 1;
};

interface TagOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  currentItems: any[]; // TODO: Fix
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  selectedTag: string;
  tagOptions: TagOption[];
  onSelectTag: (tagValue: string) => void;
}

function SearchBar({
  currentItems,
  onSearch,
  searchTerm,
  selectedTag,
  tagOptions,
  onSelectTag,
} : SearchBarProps) {
  const navigate = useNavigate();

  // This would be a good place for useCallback if performance issues arise.
  const onGetRandomClicked = () => {
    if (!canRandomize(currentItems)) return;
    const randomId =
      currentItems[Math.ceil(Math.random() * (currentItems.length - 1))]["id"];
    navigate(`/item/${randomId}`);
  };

  return (
    <div role="search" className={classes.container}>
      <div className={classes.left_search_items}>
        <input
          role="searchbox"
          aria-label="Search"
          type="text"
          placeholder=""
          id="search"
          name="search"
          onKeyUp={(e) => {
            if (e.key === "Enter") onSearch((e.target as HTMLInputElement).value);
          }}
          onBlur={(e) => onSearch(e.target.value)}
          defaultValue={searchTerm}
        ></input>
      </div>
      <div className={classes.right_search_items}>
        <Select
          aria-label="Filter by tags"
          defaultValue={
            // This is the expected format for react-select
            selectedTag ? { value: selectedTag, label: selectedTag } : ""
          }
          // TODO: extract these styles
          styles={{
            option: (baseStyles) => ({
              ...baseStyles,
              cursor: "pointer",
            }),
            control: (baseStyles, state) => ({
              ...baseStyles,
              boxShadow: "none",
              "&:hover": {
                border: state.isFocused ? "2px solid black" : "0px",
              },
              outline: "none",
              border: state.isFocused ? "2px black solid" : "0px",
              cursor: "pointer",
            }),
          }}
          onChange={(e) => {
            if (typeof e === 'object' && e !== null && 'value' in e) {
              onSelectTag(e.value);
            } else {
              onSelectTag("");
            }
          }}
          isClearable={true}
          placeholder="Filter by tag"
          options={tagOptions}
        />
        <img
          src={diceIcon}
          title="Go to a random article"
          aria-label="Go to a random article"
          className={
            canRandomize(currentItems)
              ? classes.dice_icon
              : classes.dice_icon_disabled
          }
          onClick={() => onGetRandomClicked()}
          onKeyDown={(e) => {
            if ((e.key = "Enter")) onGetRandomClicked();
          }}
          tabIndex={0} // Allow this to be focusable
        />
      </div>
    </div>
  );
}

export default SearchBar;
