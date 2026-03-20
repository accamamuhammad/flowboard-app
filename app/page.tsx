import SideBar from "./Primary/sideBar";

export default function Home() {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <SideBar />

      {/* Scrollable area */}
      <div className="flex-1 h-full bg-newt overflow-auto">
        <div className="w-[250rem] h-[500rem]">
          {/* Your massive content goes here */}
          <p>Content is now scrollable both horizontally and vertically.</p>
        </div>
      </div>
    </div>
  );
}