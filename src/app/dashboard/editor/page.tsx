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
import { SetStateAction, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SortableItem from "@/app/components/SortableItem";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  container: string;
  name: string;
  reps: number;
  sets: number;
}

const initialLeftItems: Item[] = [
  { id: "1", container: "left", name: "Item 1", reps: 5, sets: 6 },
  { id: "2", container: "left", name: "Item 2", reps: 5, sets: 6 },
  { id: "3", container: "left", name: "Item 3", reps: 5, sets: 6 },
  { id: "4", container: "left", name: "Item 4", reps: 5, sets: 6 },
  { id: "5", container: "left", name: "Item 5", reps: 5, sets: 6 },
  { id: "6", container: "left", name: "Item 6", reps: 5, sets: 6 },
  { id: "7", container: "left", name: "Item 7", reps: 5, sets: 6 },
  { id: "8", container: "left", name: "Item 8", reps: 5, sets: 6 },
  { id: "9", container: "left", name: "Item 9", reps: 5, sets: 6 },
];

export default function DndContainers() {
  const [items, setItems] = useState<Item[]>(initialLeftItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeContainer = active.data.current?.container;
    const overContainer = over.data.current?.container || over.id;

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

  return (
    <div className="flex flex-col ">
      <div className="w-full flex justify-end mt-2">
        <Button>Generate</Button>
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
            setItems={setItems}
          />

          <Container
            key={"right"}
            id={"right"}
            items={items.filter((item) => item.container === "right")}
            setItems={setItems}
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
  setItems,
}: {
  id: string;
  items: Item[];
  setItems: React.Dispatch<SetStateAction<Item[]>>;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-full h-screen ">
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <ScrollArea className="max-h-full w-full rounded-md p-4 h-screen ">
          <div ref={setNodeRef} className=" min-w-1/2 h-full">
            {items.map((item) => (
              <SortableItem key={item.id} item={item} setItems={setItems} />
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
