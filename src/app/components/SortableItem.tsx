"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { SetStateAction, useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Item {
  id: string;
  container: string;
  name: string;
  reps: number;
  sets: number;
}

const SortableItem = ({
  item,
  setItems,
}: {
  item: Item;
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
    cursor: "grab",
    background: "white",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="w-full flex gap-2 items-center justify-between">
        <div>{item.name}</div>
        <div className="flex items-center gap-2 ">
          <span>Reps</span>
          <Input
            type="number"
            defaultValue={item.reps}
            className="w-[60px]"
            ref={repRef}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <span>Sets</span>
          <Input
            type="number"
            defaultValue={item.sets}
            className="w-[60px]"
            ref={setRef}
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onMouseUp={() => {
                  setItems((prev) => [
                    ...prev,
                    {
                      id: "18",
                      container: "right",
                      name: "Item 18",
                      reps: 5,
                      sets: 6,
                    },
                  ]);
                }}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onMouseUp={() => {
                  console.log(repRef.current?.value);
                }}
              >
                Save
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
