import { useState } from "react";
import { DndContext,DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import DroppableColumn from "./DroppableColumn";

const DndKanban = () => {
  const [taskInput, setTaskInput] = useState("");
  const [taskIdCounter, setTaskIdCounter] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  const handleAddTask = () => {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: `task-${taskIdCounter}`,
      content: taskInput.trim(),
    };
    
    setTaskIdCounter((prev) => prev + 1);

    setColumns((prev) => ({
      ...prev,
      todo: [...prev.todo, newTask], 
    }));

    setTaskInput("");
  };

  const findColumnId = (taskId) => {
    return Object.keys(columns).find((col) =>
      columns[col].some((task) => task.id === taskId)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const fromColumn = findColumnId(active.id);

    const overId = over.id;
    const overColumn = findColumnId(overId);

    const toColumn = overColumn || overId; 

    if (!fromColumn || !toColumn) return;

    console.log(event);
    console.log("dragged task ", active.id);
    console.log("dropped over ", over.id);
    console.log("From column:", fromColumn);
    console.log("To column:", toColumn);


    setColumns((prev) => {
      const fromTasks = [...prev[fromColumn]];
      const toTasks = [...prev[toColumn]];
      const draggedIndex = fromTasks.findIndex((task) => task.id === active.id);

      if (fromColumn === toColumn) {
        const overIndex = toTasks.findIndex((task) => task.id === over.id);
        return {
          ...prev,
          [fromColumn]: arrayMove(fromTasks, draggedIndex, overIndex),
        };
      } else {
        const overIndex = toTasks.findIndex((task) => task.id === over.id);  //
        const [movedTask] = fromTasks.splice(draggedIndex, 1);
        
        toTasks.splice(overIndex, 0, movedTask); //  insert at hovered index

        return {
          ...prev,
          [fromColumn]: fromTasks,
          [toColumn]: toTasks,
        };
      }
    });
  };

  const handleDeleteTask = (taskId) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const col in newColumns) {
        newColumns[col] = newColumns[col].filter((task) => task.id !== taskId);
      }
      return newColumns;
    });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Kanban Board</h3>
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <DndContext onDragEnd={handleDragEnd} onDragStart={(event) => setActiveId(event.active.id)}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.entries(columns).map(([columnId, tasks]) => (
            <DroppableColumn
              key={columnId}
              id={columnId}
              title={columnId}
              tasks={tasks}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}>
              {
                (() => {
                  for (const col in columns) {
                    const found = columns[col].find((t) => t.id === activeId);
                    if (found) return found.content;
                  }
                  return null;
                })()
              }
            </div>
          ) : null}
        </DragOverlay>        
      </DndContext>
    </div>
  );
};

export default DndKanban;
