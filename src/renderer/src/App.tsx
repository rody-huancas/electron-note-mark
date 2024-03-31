import { Content, RootLayout, Sidebar, DraggableTopBar, ActionButtonRow, NotePreviewList } from "./components"

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" />
        </Sidebar>
        <Content className="border-l p-2 bg-zinc-900/50 border-l-white/20">
          Content
        </Content>
      </RootLayout>
    </>
  )
}

export default App