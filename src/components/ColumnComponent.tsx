import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../assets/icons/TrashIcon";
import { Column, Id, Task } from "./Types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../assets/icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnInput: (id : Id , value: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id , task: string) => void;
}

const ColumnComponent = (props: Props) => {
  const { column, deleteColumn, updateColumnInput, createTask, tasks, deleteTask, updateTask } = props;
  // or column = props.column

  const [editMode, setEditMode] = useState<boolean>(false);

  const taskId =  useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] border-2 border-rose-500 h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex rounded-full justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={e=> updateColumnInput(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if(e.key !== "Enter") return;
                setEditMode(false)
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon /> 
        </button>
      </div>
      {/* column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
      <SortableContext items={taskId}>
      {tasks.map(task => (
            <TaskCard updateTask={updateTask} deleteTask={deleteTask}  key={task.id} task = {task}/>
        )
      )}
        </SortableContext>
     
      </div>
      {/* column footer */}

        <button onClick={()=>createTask(column.id)} className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"><PlusIcon /> Add Task</button>
   
    </div>
  );
};

export default ColumnComponent;
