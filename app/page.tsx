import ThemeToggle from "./Primary/theme-toggle";
// import CreateBoard from "./Primary/newBoard";
// import NewTask from "./Primary/newTask";
// import EditTask from "./Primary/editTask";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col gap-6 items-center border-8 border-newt-500 justify-center bg-lighthouse">
      {/* <CreateBoard/> */}
      <ThemeToggle />
    </div>
  );
}
