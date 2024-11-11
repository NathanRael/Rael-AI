import './index.css'
import {Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";

function App() {

  return (
    <Routes>
      <Route index path={"/"} element={<Main/>}/>
    </Routes>
  )
}

export default App
