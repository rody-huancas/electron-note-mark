import { contextBridge } from 'electron'

if(!process.contextIsolated) {
  throw new Error('contextIsolated mus be enabled in the BrowserWindow');
}

try {
  contextBridge.exposeInMainWorld('context',{
    locale: navigator.language
  })
} catch (error) {
  console.log(error);
  throw error;
}