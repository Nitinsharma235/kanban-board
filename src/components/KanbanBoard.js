import { useState,useRef } from 'react';

const KanbanBoard = () => {

  const [boardData, setBoardData] = useState({
    todo: [],
    in_progress: [],
    done: []
  });

  const inputRefs = useRef({});
  
  function handleAdd(column) {
  const input = inputRefs.current[column];
  const value = input?.value.trim();
  if (!value) return;

  setBoardData(prev => ({
    ...prev,
    [column]: [...prev[column], value],
  }));

  input.value = '';
}


  const onDragStart = (e, task, fromColumn) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("from", fromColumn);
    console.log("onDragstart on : ",task ,"from",fromColumn ,"column");
  }

  const onDrop = (e, toColumn) => {
    console.log("e",e);
    
    const task = e.dataTransfer.getData("task");
    const fromColumn = e.dataTransfer.getData("from");
    console.log("onDrop of :",task,"from",fromColumn,"column")

    if (fromColumn === toColumn) return;

    setBoardData(prev => {
      const updated = { ...prev };
      updated[fromColumn] = updated[fromColumn].filter(t => t !== task);
      updated[toColumn] = [...updated[toColumn], task];
      return updated;
    });
  }

  return (
    <div style={styles.board}> 
      {Object.entries(boardData).map(([columnName, tasks]) => (
       
        <div key={columnName}
         style={styles.column} 
          onDragOver={(e) => e.preventDefault()} 
            onDrop={(e) => onDrop(e, columnName)}>
          <h3>{columnName.toUpperCase()}</h3>
          {tasks.map((task, index) => (
            <div key={index} 
             style={styles.card} 
              draggable="true" 
               onDragStart={(e) => onDragStart(e, task, columnName)}>{task}</div>
          ))}
          <div style={{bottom: '0px',position:'absolute'}}>
          <input type="text" placeholder="enter here" ref={(el) => (inputRefs.current[columnName] = el)} />
          <button onClick={() => handleAdd(columnName)}>Add Task</button>  
          </div>
        </div>
       
      ))}
    </div>
     
  );
};

const styles = {
  board: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px'
  },
  column: {
    width: '200px',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '8px',
    minHeight: '300px',
    position:'relative',
    paddingBottom: '100px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '10px',
    margin: '8px 0',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  }
};

export default KanbanBoard;



