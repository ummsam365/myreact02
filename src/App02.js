// ** 최적화
// => 웹서비스의 성능을 개선하는 기술
// => 불필요하게 낭비되는 연산을 줄여 랜더링의 성능을 높여줌.

// ** 리액트의 연산 최적화 
// => 메모이제이션(Memoization) 기법
//    직역하면 메모하는 방법 으로
//    특정 입력에 대한 결과를 저장했다가, 동일한 요청이 들어오면
//    저장해둔 결과값을 제공하므로 빠르게 응답하며
//    불필요한 연산을 줄여주는 기술
// => 이러한 기능을 알고리즘에서는 Dynamic(동적) Programming (DP) 라함.
// => 리액트의 연산 최적화 기법
//  - useMemo(), useCallback(), React.memo(컴포넌트)

// ** useMemo()
// => 함수의 불필요한 재실행 방지
// => 메모이제이션(Memoization) 기법을 이용해 연산의 결과값을
//    기억해 두었다가 필요할때 사용함으로 불필요한 함수호출을 줄여주는 훅.  
// => const value = useMemo(callback, [todo, member...]);
//    의존성배열의 값이 바뀌면 callback 함수를 실행하고 결과값 return
// => TodoList 의 analyzeTodo 함수로 Test

// => useEffect 와 비교하기   
//  -> useEffect(callback_함수, [deps]_의존성 배열)
//    두번째 인자인 의존성 배열요소의 값이 변경되면 첫번째 인자인 콜백함수를 실행함 
//    ( 결과를 return 하지않음 )

//  -> useMemo() 와 useEffect() 차이점  
//    - useMemo는 랜더링 직전 실행, useEffect는 랜더링 직후 실행
//    - useMemo는 callback함수 결과값 return, useEffect는 결과 return 하지않음
//    - useMemo는 함수 최적화용, 
//      useEffect는 side effect (myreact01_App03 참고)
//      랜더링 후에 실행되어야 하는 작업들을 의미, 
//      예를 들면 전역변수 수정, 서버에서 데이터를 받아오거나, 수동으로 DOM 조작등 

// ** useCallback()
// => 함수의 불필요한 재생성 방지
//    컴포넌트 리랜더링시 내부의 함수를 재생성하지 않도록 메모이제이션함.  
// => useCallback(callback, [의존성배열])
//    [의존성배열] 이 변경되면 callback 함수를 재생성 return 함.
// => useCallback(callback, [])
//    비어있는 배열을 전달하면 callback 함수는 마운트시에만 생성되고, 이후에는 재생성 되지않음
// => 주의사항
//    이때 callback 함수내부에서 State 변수에 접근한다면, 
//    마운트시의  State 변수값만 사용할 수있으므로 주의해야 함.
//    이것을 해결하려면 "함수형 업데이트" 기능을 이용해야함
//  
// => 아래의 onUpdate, onDelete 함수를 리랜더링 할때마다 재생성 하지 않도록 적용.

// ** React.memo
// => 컴포넌트의 불필요한 리랜더링을 방지해주는 고차 컴포넌트 (Header 에 적용)
// => 리랜더링의 기준은 부모에서 전달된 Props가 변경된 경우에만 리랜더링됨    
// => React.memo(메모이제이션 하려는 컴포넌트)
//    인자로 전달된 컴포넌트를 메모이제이션 된 컴포넌트로 return
//    이를 Enhanced(강화된, 향상된) Component 라함.
// => 컴포넌트 선언과 동시에 적용하는것 도 가능
//    const comp = React.memo(() => {....})

// => 고차 컴포넌트 (HOC: High Order Component)
//    컴포넌트 기능을 재사용 하기위한 리액트 고급기술 
//    인자로 전달된 컴포넌트에 새로운 기능을 추가해 
//    더욱 강화된 컴포넌트를 return 하는 컴포넌트(함수) 를 말하며
//    이때 return 되는 강화된 컴포넌트를 Enhanced(강화된, 향상된) Component 라함.   
// => const enhanced_Component = React.memo(Header)
 

// =================================================
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components01/Header';
import TodoEditor from './components01/TodoEditor';
import TodoList from './components01/TodoList';

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
      <TodoEditor onCreate={onCreate} />
      <TodoList todo={todo} onUpdate={onUpdate} onDelete={onDelete}/>
    </div>
  );
}
export default App;
