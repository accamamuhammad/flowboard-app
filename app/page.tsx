import ThemeToggle from "./Primary/theme-toggle";
import NavBar from "./Primary/navBar";
// import CreateBoard from "./Primary/newBoard";
// import NewTask from "./Primary/newTask";
// import EditTask from "./Primary/editTask";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col gap-6 items-center justify-center bg-lighthouse">
      <ThemeToggle />
    </div>
  );
}
