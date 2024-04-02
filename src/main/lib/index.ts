import { appDirectoryName, fileEncoding } from '../../shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, GetNotes, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { writeFileSync } from 'fs'
import { ensureDir, readdir, stat, readFile, writeFile } from 'fs-extra'
import { homedir } from 'os'
import path from 'path'

export const getRootDir = () => {
  // return `${homedir()}/OneDrive/Escritorio/${appDirectoryName}`
  return path.join(homedir(), appDirectoryName);
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  console.log(rootDir)
  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)
  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async(filename, content) => {
  const rootDir = getRootDir();

  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding });
}

export const createNote: CreateNote = async() => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{name: 'Markdown', extensions: ['md']}]
  });

  if(canceled || !filePath) {
    return false;
  } 

  const { name: filename, dir: parentDir } = path.parse(filePath);
  
  if(parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'La creación ha fallado',
      message: `Todas las notas deben guardarse en ${rootDir}. Evite utilizar otros directorios.`
    });
    return false;
  }

  await writeFileSync(filePath, '');

  return filename;
}