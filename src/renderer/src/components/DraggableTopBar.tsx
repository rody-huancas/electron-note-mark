export const DraggableTopBar = () => {
  return (
    <header className="absolute inset-0 h-8 bg-transparent">
      <nav className="w-[250px] h-full flex items-center justify-center bg-zinc-900/75 text-gray-100 p-2 text-lg">
        <h1 className="font-extrabold">
          Note<span className="text-indigo-400">Mark</span>
        </h1>
      </nav>
    </header>
  );
};
