import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTask from "./DraggableTask";


const DroppableColumn = ({ id, title, tasks,onDelete }) => {
  const {setNodeRef} = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} id={id}  style={columnStyle}>
      <h3>{title.toUpperCase()}</h3>
     <SortableContext items={tasks.map(t => t.id)} >
      {tasks.map((task) => (
        <DraggableTask key={task.id} task={task} onDelete={onDelete} />
      ))}
    </SortableContext>

    </div>
  );
};

const columnStyle = {
  flex: 1,
  minHeight: "300px",
  border: "1px solid gray",
  borderRadius: "8px",
  padding: "1rem",
  backgroundColor: "#d8f8c8",
};

export default DroppableColumn;


