import { useRef } from "react"
import { Content, RootLayout, Sidebar, DraggableTopBar, ActionButtonRow, NotePreviewList, MarkdownEditor, FloatingNoteTitle } from "./components"

const App = () => {
  const contenteContainerRef = useRef<HTMLDivElement>(null);

  const resetScroll = () => {
    contenteContainerRef.current?.scrollTo(0, 0);
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>
        <Content className="border-l p-2 bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className="pt-2" />
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App