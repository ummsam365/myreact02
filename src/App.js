//** Context 기본 적용
//=> ----.=uiop 

// ** Context (문맥)
//    글이 지닌 방향성, 글(문장)이 궁극적으로 전달하려는 뜻 이나 목적.

// ** 리액트 Context
// => 같은 Context(문맥, 동일목적) 하에 있는 컴포넌트 그룹에 데이터를 공급한다는 의미로 
//    리액트 컴포넌트 트리 전체를 대상으로 데이터를 공급하는 기능이며,  
//    Props Drilling 문제를 해결할 수 있음.
// => Props Drilling 문제 란?
//    리액트 컴포넌트의 계층구조에서 컴포넌트간에 Data를 전달할때 Props를 사용.
//    이 Props는 부모에서 자식으로 단방향으로만 전달 가능하기 떄문에,
//    2단계이상 떨어져있는 컴포넌트에 Data 를 전달하려면,
//    직접 전달할수 없기 때문에 경로상의 모든 컴포넌트에 Props를 전달해야하는데,
//    이것을 드릴로 땅을 파내려가는것과 같다고하여 붙여진 명칭이다.   

// ** Context API
// => 리액트 Context 를 만들고 다루는 기능
// => Context 생성 (컴포넌트 밖에): React.createContext 
   
// => Context 에 Data 공급 : Context.Provider (Context 객체에 포함된 컴포넌트) 
//    - 컴포넌트 내부에 배치
//    - Context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할.
//    - value prop 값을 받아 하위의 컴포넌트에게 전달.
//    - 값의 갯수는 제한이 없고, 이를 전달 받을 수 있는 컴포넌트 수의 제한도 없다.
//    - Provider 하위에서 context를 구독하는 모든 컴포넌트는 Provider의 value가 바뀔 때마다 리렌더링됨.

// => Context가 공급하는 Data 사용하기
//    - useContext(Context)
//      인자는 Data를 공급할 Context 이고, 
//      이 Context 가 제공하는 Data를 return 함.   

// =================================================

import { useState, useRef, useCallback } from 'react';
import React from 'react';
import './App.css';
import Header from './components01/Header';
import TodoEditor from './components03/TodoEditor';
import TodoList from './components03/TodoList';

// ** Mock Data
const mockTodo = [
  { id: 0,
    isDone: false,
    content: 'React 공부하기',
    createDate: new Date().getTime()
  },
  { id: 1,
    isDone: false,
    content: 'MySql 공부하기',
    createDate: new Date().getTime()
  },
  { id: 2,
    isDone: false,
    content: 'Java 예습하기',
    createDate: new Date().getTime()
  },
  { id: 3,
    isDone: true,
    content: 'JavaScript 공부하기',
    createDate: new Date().getTime()
  },
  { id: 4,
    isDone: false,
    content: 'Spring 예습하기',
    createDate: new Date().getTime()
  }
] ;

//** Context 적용
//1) Context 생성
//=> 반드시 컴포넌트 밖에서 생성 (리랜더링 될때마다 재생성되지 않도록함)
//=> 다른 문서(화일)의 컴포넌트들이 인식 가능하도록 export 해야함.
//=> 생성문 : React.createContext(default_value)
//           이때 인자 default_value 는 생성시에 적절한  Provider 찾지못했을때 사용되는값 
export const TodoContext = React.createContext();
//2) Provider 배치 
//=> Data 를 공급받아야 할 컴포넌트들을 감싸줌

function App() {
  //1) 배열을 리스트로 랜더링하기
  const [todo, setTodo] = useState(mockTodo);

  //2) 새일정 추가
  const idRef = useRef(todo.length); 
  
  const onCreate = (content) => {
    const newItem = {
      id: idRef.current,
      //id: todo.length, 
      //=> todo.length 를 사용하면 삭제시에 배열길이가 줄어들면
      //   같은 id값을 가지는경우 발생
      //=> ref 변수를 사용해서 처음 배열길이를 보관하고 입력할때 마다 증가시켜줌
      content: content,
      isDone: false,
      createDate: new Date().getTime()
    };
    setTodo([newItem, ...todo]);
    idRef.current += 1; // 추가후 증가 시켜줌
  }; //onCreate

  //3) 일정 수정
  const onUpdate = (updateId) => {
    setTodo(todo.map((it)=> it.id===updateId ?
                          {...it, isDone: !it.isDone} : it ));
  }; //onUpdate

  //4) 일정 삭제
  const onDelete = (deleteId) => {
    setTodo(todo.filter( (it) => it.id !== deleteId ));
  }
  //===========================================================
  //** useMemo() 와 useEffect() 비교
  //=> 실행 시점 : 모두 마운트시에만 호출되도록 [] 사용
  //=> 실행 순서 :  useMemo(랜더링전) -> App Update(랜더링) -> useEffect(랜더링후)
  //useMemo(()=>{console.log(`** useMemo Call !!! **`)}, []);   
  //useEffect(()=>{console.log(`** useEffect Call !!! **`)}, []);  

  //** useCallback  
  //=> [] : 마운트시에만 생성되도록 ([todo] 와 비교)
  //=> 상태변수 값은 생성시의 값을 유지(update 되지않음)
  //=> ref 값은 실행시에 전달받음
  const test = useCallback(()=>{ 
          console.log(`** todo.length=${todo.length}, idRef.current=${idRef.current}`) 
        }, []); 
  test();      

  console.log(`** App Update !!! **`);
  return (
    <div className="App">
      <Header />
      {/* 
      2) Provider 배치
        => Props로 Data를 공급받아야하는 컴포넌트들을 Provider 로 감싼다.
        => Provider에 공급할 Data 를 전달(설정)
           value 속성으로  Props 에 공급하려는 모든 Data 를 객체로 담는다.  
        => Provider 내부의 (Context에 소속된) 컴포넌트들은 별도로 Props를 받을 필요가 없으므로 
           기존의 Props는 제거한다.   
      3) Data 사용하기
        => Data를 공급받는 컴포넌트에서는 useContext() 를 이용해 사용가능.  
      */} 
      <TodoContext.Provider value={ {todo, onCreate, onUpdate, onDelete} }>
        <TodoEditor />
        <TodoList />
      </TodoContext.Provider>
    </div>
  );
}
export default App;
