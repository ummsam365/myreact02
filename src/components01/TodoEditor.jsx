
import './TodoEditor.css';
import { useRef, useState } from 'react';
import React from 'react';

function TodoEditor({onCreate}) {

  const [content, setContent] = useState('');
  const onChangeContent = (e) => {setContent(e.target.value)};

  //=> 새일정 등록
  //  -> 등록전에 입력값 점검 (무결성 확인) : 입력여부
  const textRef = useRef();
  const onSubmit = () => {
    if (!content) {
      //=> content 가 비어있다면
      //  focus 를 content 에 머물도록하여 빈 Data 저장을 방지
      textRef.current.focus();
      return; //함수종료
    }else {
      onCreate(content); 
    };//if_else
    textRef.current.focus();
    setContent('');
  }; //onSubmit

  //=> 입력 Key값 활용 Test
  //=> 일정 입력후 Enter 눌러도 저장 되도록 onSubmit 함수 호출
  const onKeyDownContent = (e)=>{
    if ( e.keyCode === 13 ) onSubmit();
  }

  console.log(`** TodoEditor Update !!! **`);
  return (
    <div className="TodoEditor">
      <h5>새로운 일정 등록</h5>
      <div className="editor_wrapper">
        <input  ref={textRef} value={content}
                onChange={onChangeContent}
                onKeyDown={onKeyDownContent}
                placeholder="새로운 일정을 입력 하세요 ~~"/>
        <button onClick={onSubmit} >추가</button>        
      </div>
    </div>
  ); //return
} //TodoEditor

export default React.memo(TodoEditor);