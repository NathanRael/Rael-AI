import {useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import "./index.css";
import {Button} from "rael-ui";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name] = useState("");

  async function greet() { 
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
   <section className={"p-10"}>
       <p>{greetMsg}</p>
       <Button onClick={() => greet()}>Greet</Button>
   </section>
  );
}

export default App;
