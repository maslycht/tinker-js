import CodeCell from "./components/CodeCell.tsx";
import TextEditor from "./components/TextEditor.tsx";
import { Provider } from "react-redux";
import { store } from "./state";

function App() {
  return (
    <Provider store={store}>
      <div>
        {/*<CodeCell />*/}
        <TextEditor />
      </div>
    </Provider>
  );
}

export default App;
