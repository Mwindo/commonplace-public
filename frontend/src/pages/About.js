import { motion } from "framer-motion";
import classes from "./About.module.css";
import textStyles from "../styling/TextStyles.module.css";

function AboutPage() {
  return (
    <motion.div
      initial={{ y: window.innerHeight }}
      animate={{ y: 0 }}
      exit={{
        y: window.innerHeight,
        opacity: 0,
        transition: { duration: 0.1 },
      }}
    >
      <div className={classes.title}>About</div>
      <div className={classes.text_body}>
        <div className={classes.quotation}>
          It is a wholesome plan, in thinking about logic, to stock the mind
          with as many puzzles as possible.
          <br />
          --Bertrand Russel,{" "}
          <a
            className={textStyles.text_link}
            href="https://en.wikipedia.org/wiki/On_Denoting"
            target="_blank"
            rel="noreferrer"
          >
            "On Denoting"
          </a>
        </div>
        <br />
        <div className={textStyles.quotation}>
          A great discovery solves a great problem but there is a grain of
          discovery in the solution of any problem.
          <br />
          --George Pólya,{" "}
          <a
            className={textStyles.text_link}
            href="https://en.wikipedia.org/wiki/How_to_Solve_It"
            target="_blank"
            rel="noreferrer"
          >
            <i>How to Solve It</i>
          </a>
        </div>
        <br />
        A long time ago, a friend asked me what I was passionate about. After
        hesitating, I said, "Ideas."
        <br />
        <br />
        "What kind of ideas?" they asked.
        <br />
        <br />
        This rather stumped me. It was a perfectly natural question, and I felt
        myself perfectly embarrassed to be unable to answer. In fact, I didn't{" "}
        <i>have</i> a particular kind of idea in mind--at least, not any I could
        think of. An elegant solution to a mathematics puzzle, a deviously
        clever rhyme, a haunting musical phrase--what matter was it what{" "}
        <i>kind</i> of idea? I treasured these <i>moments musicaux</i> alike for
        the spirit of ingenuity they revealed, often taking something and
        transforming it in an unexpected way, rotating, as it were, a 2-D image
        in the third dimension... <br />
        <br />
        What I hope to document here are what, in my mind, constitute little
        flashes or "grains" of brilliance in one form or another. Sometimes,
        they are simply representative (or paradigmatic) snapshots of a
        brilliant work as a whole. Sometimes, they are the exception in an
        otherwise drab affair. Whatever their source, the point is to collect
        here as many of these moments as possible in order for me to "stock the
        mind" with them. Perhaps, with just such a stockpile of ideas at my
        disposal, I can myself produce something of value, or help others to do
        so.
        <br />
        <br />
        In other words, this is a sort of{" "}
        <a
          className={textStyles.text_link}
          href="https://en.wikipedia.org/wiki/Commonplace_book"
          target="_blank"
          rel="noreferrer"
        >
          commonplace book
        </a>
        . Hence the title.
        <br />
        <br />
        Inevitably, many of these flashes are contingent upon my vantage point.
        Sometimes, I may have simply been forced to find the beauty in
        something, for sanity's sake, after being stuck with it for one reason
        or another. There will be a hodgepodge of the high and the low, the
        sublime and the kitsch. This is typical of commonplace books, after all,
        which unite unlikely neighbors. There will also be miscellaneous
        reflections and interpretations in the wide-ranging, dubious manner of{" "}
        <a
          className={textStyles.text_link}
          href="https://bestiary.ca/intro.htm"
          target="_blank"
          rel="noreferrer"
        >
          bestiaries
        </a>{" "}
        and{" "}
        <a
          className={textStyles.text_link}
          href="https://en.wikipedia.org/wiki/Lapidary_(text)"
          target="_blank"
          rel="noreferrer"
        >
          lapidaries
        </a>{" "}
        and{" "}
        <a
          className={textStyles.text_link}
          href="https://en.wikipedia.org/wiki/Etymologiae"
          target="_blank"
          rel="noreferrer"
        >
          etymologies
        </a>
        . This is perhaps less typical.
        <br />
        <br />I suppose this is all my way of answering--extensively, at least,
        since an intensive definition yet eludes me--my old friend's question,
        "What <i>kind</i> of ideas?"
      </div>
    </motion.div>
  );
}

export default AboutPage;
