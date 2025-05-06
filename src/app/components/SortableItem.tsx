"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { SetStateAction, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  container: string;
  name: string;
  reps: number;
  sets: number;
}

const SortableItem = ({
  item,
  items,
  rightItems,
  setItems,
}: {
  item: Item;
  items: Item[];
  rightItems: Item[];
  setItems: React.Dispatch<SetStateAction<Item[]>>;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      container: item.container,
    },
  });

  const repRef = useRef<HTMLInputElement>(null);
  const setRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: "white",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="w-full flex gap-2 items-center justify-between">
        <div>{item.name}</div>
        <div className="flex items-center gap-2 ">
          <span>Reps</span>
          <Input
            type="number"
            defaultValue={item.reps}
            className="w-[60px]"
            ref={repRef}
            disabled={item.container === "left"}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <span>Sets</span>
          <Input
            type="number"
            defaultValue={item.sets}
            className="w-[60px]"
            ref={setRef}
            disabled={item.container === "left"}
          />
        </div>
        <Button
          variant="outline"
          disabled={item.container === "left"}
          onClick={() => {
            // console.log(rightItems);
            // console.log(item);
            // console.log(rightItems.indexOf(item));
            const itemToChange = rightItems.slice(rightItems.indexOf(item))[0];
            const newItem = {
              ...itemToChange,
              reps: Number(repRef.current?.value!),
              sets: Number(setRef.current?.value!),
            };
            console.log(newItem);

            setItems(
              rightItems.toSpliced(rightItems.indexOf(item), 1, newItem)
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 hover:text-blue-600 focus:text-blue-700 transition duration-150 ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true" // Hide from screen readers if it's purely decorative or has adjacent text
            // Add role="img" and <title>Save</title> if it needs semantic meaning and has no adjacent text
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2l3-3h6l3 3h2a2 2 0 012 2v3m-6-7v4m0 0H9m4 0h2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Button>
        <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
          ⠿
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
