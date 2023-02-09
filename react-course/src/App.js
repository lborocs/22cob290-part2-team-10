import Todo from "./components/Todo";
import Progressbar from "./components/Progressbar";

function App() {
  return (
    <div>
      <Todo text="Learn React" />
      <Todo text="Master React" />
      <Todo text="Explpore React" />
      <Progressbar />
    </div>
  );
}

export default App;
