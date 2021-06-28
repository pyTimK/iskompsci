import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Course } from "../classes/Course";
import { CrossFadePageContext } from "../Home";

export type HandleCourseTap = (params: {
  e: MouseEvent | TouchEvent | PointerEvent;
  subject: string;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  exitAnimate: () => Promise<void>;
}) => void;

interface Props {
  course: Course;
  handleCourseTap: HandleCourseTap;
  subject: string;
  initialStatus: string;
}

const CourseBox: React.FC<Props> = ({ course, handleCourseTap, subject, initialStatus }) => {
  const classes = useStyles();
  const [status, setStatus] = useState(initialStatus);
  const divRef = useRef<HTMLButtonElement>(null);

  const divFullScreenAnimate = useContext(CrossFadePageContext);

  const exitAnimate = async () => {
    if (!divRef.current) return;
    const domRect = divRef.current.getBoundingClientRect();
    divFullScreenAnimate?.set({
      x: domRect.x,
      y: domRect.y,
      width: domRect.width,
      height: domRect.height,
      backgroundColor: `var(--${status}Color)`,
    });
    await divFullScreenAnimate?.start({
      opacity: 1,
      x: 0,
      y: 0,
      width: window.screen.width,
      height: document.documentElement.clientHeight,

      backgroundColor: "var(--materialgreen)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    });
  };

  return (
    <motion.button
      style={{ outline: "none" }}
      ref={divRef}
      onTap={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleCourseTap({ e, subject, status, setStatus, exitAnimate });
      }}
      whileTap={{ scale: 0.8 }}
      className={clsx(classes.courseBox, "noselect", status)}
      unselectable='on'
      onSelectCapture={() => false}
      onMouseDown={() => false}
      key={course.id}>
      <p className='noselect'>{course.subject}</p>
    </motion.button>
  );
};

const useStyles = makeStyles((theme) => ({
  courseBox: {
    display: "inline-block",
    fontFamily: "metropolis, Roboto Mono, Arial",
    color: "white",
    padding: "10px 10px",
    borderRadius: 0,
    border: "none !important",
    boxShadow: "0px 1px 1px #333",
    overflow: "hidden",
    margin: 4,
    userSelect: "none",

    "&:hover": {
      cursor: "pointer",
    },

    "& p": {
      userSelect: "none",
      fontSize: "0.8rem !important",
    },
  },
}));

export default CourseBox;