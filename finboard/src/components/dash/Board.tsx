'use client';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@/lib/store';
import Widget from './Widget';

export default function Board() {
  const { ws, reorder } = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = ws.findIndex((w) => w.id === active.id);
      const newIndex = ws.findIndex((w) => w.id === over.id);
      reorder(arrayMove(ws, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white dark:bg-black transition-colors duration-300">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ws} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ws.map((w) => (
              <Widget key={w.id} cfg={w} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {ws.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <p>No widgets yet.</p>
          <p className="text-sm">Click "Add Widget" to get started.</p>
        </div>
      )}
    </div>
  );
}