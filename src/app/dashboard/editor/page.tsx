"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SortableItem from "@/app/components/SortableItem";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { exerciseSchema, pb } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Item {
  id: string;
  container: string;
  name: string;
  reps: number;
  sets: number;
}

const initialLeftItems: Item[] = [
  { id: nanoid(), container: "left", name: "Item 1", reps: 5, sets: 6 },
  { id: nanoid(), container: "left", name: "Item 2", reps: 5, sets: 6 },
  { id: nanoid(), container: "left", name: "Item 3", reps: 5, sets: 6 },
  { id: nanoid(), container: "left", name: "Item 4", reps: 5, sets: 6 },
];

export default function DndContainers() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [rightItems, setRightItems] = useState<Item[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);

  const getExercises = async () => {
    const exercises = await pb.collection("exercises").getFullList();
    if (exercises.length > 0) {
      const results = exerciseSchema.safeParse(exercises);
      if (!results.success) {
        console.log("error", results.error);
        return;
      } else {
        setItems(results.data);
      }
    }
  };

  useEffect(() => {
    getExercises();
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging
        delay: 250, // Add delay to distinguish from clicks
        tolerance: 5,
        cancel: "input, select, button", // Cancel drag for form elements
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
        cancel: "input, select, button",
      },
    })
  );
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeContainer = active.data.current?.container;
    const overContainer = over.data.current?.container || over.id;

    if (overContainer === "right") {
      const activeItem = items.find((item) => item.id === active.id);

      const rightItemsId = rightItems.map((item) => item.id);

      if (!rightItemsId.includes(activeItem?.id!)) {
        setRightItems((prev) => [...prev, activeItem!]);
      }
    }

    setItems((items) => {
      const activeItem = items.find((item) => item.id === active.id);

      if (activeItem && activeContainer !== overContainer) {
        activeItem.container = overContainer;
        return [...items];
      }

      return arrayMove(
        items,
        items.findIndex((i) => i.id === active.id),
        items.findIndex((i) => i.id === over.id)
      );
    });

    setActiveId(null);
  };
  const reorderArray = (array1: Item[], array2: Item[]) => {
    // Create a map for quick lookup from array1
    const array1Map = new Map();
    array1.forEach((item: Item) => array1Map.set(item.id, item));

    // Rebuild array1 in the order of array2's IDs
    return array2.map((item: Item) => {
      const matchedItem = array1Map.get(item.id);
      if (!matchedItem) {
        console.log(`Item with ${item.id} not found in source array`);
      }
      return matchedItem;
    });
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full flex mt-2 gap-2">
        <div className="w-1/2 flex pl-2">
          <Input
            ref={nameRef}
            placeholder="Workout Name"
            className="w-[200px]"
          />
        </div>
        <div className="w-1/2 flex justify-end pr-2">
          <Button
            variant="outline"
            onClick={async () => {
              if (nameRef.current && nameRef.current!.value) {
                const filteredItems = items.filter(
                  (item) => item.container === "right"
                );
                const orderedRightItems = reorderArray(
                  rightItems,
                  filteredItems
                );

                if (orderedRightItems.length > 0) {
                  await pb.collection("workouts").create({
                    name: nameRef.current?.value,
                    exercises: orderedRightItems,
                  });
                }
              }
            }}
          >
            save
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full h-full justify-center">
          <Container
            key={"left"}
            id={"left"}
            items={items.filter((item) => item.container === "left")}
            rightItems={rightItems}
            setRightItems={setRightItems}
          />

          <Container
            key={"right"}
            id={"right"}
            items={items.filter((item) => item.container === "right")}
            rightItems={rightItems}
            setRightItems={setRightItems}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <ItemOverlay
              id={activeId}
              item={items.find((i) => i.id === activeId)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Container({
  id,
  items,
  rightItems,
  setRightItems,
}: {
  id: string;
  items: Item[];
  rightItems: Item[];
  setRightItems: React.Dispatch<SetStateAction<Item[]>>;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-full h-screen ">
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <ScrollArea className="max-h-full w-full rounded-md p-4 h-screen ">
          <div ref={setNodeRef} className=" min-w-1/2 h-full">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                items={initialLeftItems}
                rightItems={rightItems}
                setItems={setRightItems}
              />
            ))}
          </div>
        </ScrollArea>
      </SortableContext>
    </div>
  );
}

function ItemOverlay({ id, item }: { id: string; item?: Item }) {
  return (
    <div
      style={{
        background: "white",
        padding: "10px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        cursor: "grabbing",
      }}
    >
      {item?.name}
    </div>
  );
}
