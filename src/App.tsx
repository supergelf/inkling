import "./App.css";
import TitleBar from "./components/TitleBar/TitleBar";
import { HashRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Note from "./pages/Note/Note";

// Example usage
async function readUserFile() {
  try {
    const content = await window.electron.readFile("path/to/your/file.txt");
    console.log("File content:", content);
  } catch (error) {
    console.error("Failed to read file:", error);
  }
}

async function writeUserFile() {
  try {
    await window.electron.writeFile("path/to/your/file.txt", "Hello, World!");
    console.log("File written successfully");
  } catch (error) {
    console.error("Failed to write file:", error);
  }
}

function App() {
  return (
    <>
      <TitleBar />
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Note />} />
      </Routes>
    </>
  );
}

export default App;
