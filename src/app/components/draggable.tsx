"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const Draggable = ({ id = 0 }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${id}`,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      Title {id}
    </button>
  );
};

export default Draggable;
