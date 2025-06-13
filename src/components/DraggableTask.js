// import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DraggableTask = ({task, onDelete}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id, 
    
  });
  const style = {
    padding: ".5rem 1rem",
    marginBottom: "0.5rem",
    backgroundColor: isDragging ? "#d0e0e3" : "#fff",
    border: "2px solid #ccc",
    borderRadius: "8px",
    boxShadow: isDragging ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
    cursor: "grab",
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  
  return (
       <div ref={setNodeRef} style={style} {...attributes} >
        
         <span {...listeners} style={{ flexGrow: 1, cursor: "grab" }}>{task.content}</span>
         <button onClick={() =>  onDelete(task.id)} style={{ marginLeft: "1rem" }}>X</button>
       </div>
  )
}


export default DraggableTask
