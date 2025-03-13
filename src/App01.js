
// ** 최적화 적용
// => 부모 랜더링시 자식 컴포넌트는 무조건 랜더링 되며 이때 모든 변수값은 초기화되고, 함수는 재호출된다.
//    이로 인한 불필요한 리랜더링을 방지하여 실행시 효율성 향상켜주는것을 말함.  

// => 랜더링 최적화: React.memo (메모이제이션)
//    부모컴포넌트의 영향에서 벗어나 마운트시에만 랜더링함.
//  - Header(Props없는경우) : 부모컴포넌트의 영향에서 벗어남
//  - TodoEditor(Props있는경우) : 부모컴포넌트의 영향에서 벗어나지못함

// => 함수 호출의 최적화: useMemo(callback, [의존성배열])  
//    두번째 인자인 의존성배열 의 값이 바뀌었을때만 callback 함수를 실행하고 결과값을 return함.
//    TodoList

// ** Mock Data
// => Mock Data: 모조 Data (개발중 테스트 목적으로 사용하는 Data)
// => 할 일 item(Data_set) 을 담을 배열 생성
// => 앞으로 데이터를 저장하고 관리할 배열, Data_Table 역할
// => 구조
//    id : 아이템 식별을 위한 고유키
//    isDone: 할일 완료 여부 ( boolean )
//    content: 해야 할 일정
//    createDate: 일정 생성(등록) 시간
// => new Date().getTime()
//    Date 값을 getTime 메서드를 이용해 타임스템프 값으로 변환
//    이렇게 하면 보관데이터 용량이 줄어듬

// ** Date 주요 메서드
// => toDateString() :  날짜를 문자열로
// => toLocaleDateString() : 지역별 맞는 포맷으로

// ** 실습 ***************************************
// 1) 배열을 리스트로 랜더링하기
// => App.js
//  -> Mock Data mockTodo 를 state 변수 todo 로
//  -> todo 를 Props 이용하여 TodoList 로 전달
// => TodoList
//  -> 전달받은 배열을 map 메서드로 1건씩 TodoItem 으로 전달
//    ( map 을 이용해 컴포넌트 반복하기 )

// => 조건 추가하기 (검색기능)

// 2) 입력 (할일 추가)
// => TodoEditor
//  -> 새 item 입력, 추가 버튼 클릭
//  -> 부모 App 에게 이벤트 발생을 알리고 item 전달
// => App
//  -> 전달받은 새 item 을 배열에 추가, 
//  -> state변수인 todo 값 수정
// => TodoEditor: 입력폼 초기화   

// 3) 일정 수정

// 4) 일정 삭제

// =================================================
import { useState, useRef } from 'react';
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
  //=> 새일정
  //  -> 추가할 일정 객체 생성 (newItem)
  //  -> 생성된 객체를 상태변수 todo 배열에 추가
  //    [기존todo배열 + newItem]
  //  -> 단, 출력순서를 고려해서 index 값 0 이 되도록 추가
  //    ( id 값 과 index 는 별개로 취급 )
  //  -> id 값
  //    . todo 배열의 길이, useRef 로 정의 
  //=> 새일정 함수 : TodoEditor 컴포넌트에 전달

  const idRef = useRef(todo.length); 
  //=> 처음 1회 초기화
  //=> id 값을 만들기 위한 용도
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
    // let color1 = ['red', 'white' ];
    // let color2 = ['black', 'pink', ...color1] ;

    idRef.current += 1; // 추가후 증가 시켜줌
  }; //onCreate

  //3) 일정 수정
  //=> Checked 수정 (checked:완료, unChecked:미완료)
  //=> todo 에서 id가 일치하는 item의 isDone 값 변경
  //=> todo.map 으로, 수정할 id만 전달받으면 됨 
  const onUpdate = (updateId) => {
    setTodo(todo.map((it)=> it.id===updateId ?
                          {...it, isDone: !it.isDone} : it ));
  }; //onUpdate

  //4) 일정 삭제
  const onDelete = (deleteId) => {
    setTodo(todo.filter( (it) => it.id !== deleteId ));
  }

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
