
import './TodoItem.css';
import React from 'react';

import { useContext } from 'react';
import { TodoContext } from '../App';

function TodoItem({id, isDone, content, createDate}) {

  //** Context 적용 : useContext()
  const {onUpdate, onDelete} = useContext(TodoContext);

  const onChangeCheckBox = () => {
    //=> 변경된 CheckBox 값이 -> todo 에 반영해서 수정되어야함 
    onUpdate(id);
  }

  console.log(`** TodoItem Update !!! **`);
  return (
    <div className="TodoItem">
      <div><input type="checkbox" checked={isDone} onChange={onChangeCheckBox} /></div>
      {/* <div><input type="checkbox" checked={isDone} onChange={()=>{onUpdate(id)}} /></div> */}
      <div className="title_col">id_{id}.  {content}</div>
      <div className="date_col">{new Date(createDate).toLocaleDateString()}</div>
      <div className="btn_col"><button onClick={() => onDelete(id)}>삭제</button></div>
    </div>
  ); //return
}

//export default React.memo(TodoItem);
export default TodoItem;