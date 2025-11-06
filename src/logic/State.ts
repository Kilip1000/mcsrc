import { BehaviorSubject, map } from "rxjs";

export interface State {
  version: number; // Allows us to change the permalink structure in the future
  minecraftVersion: string;
  file: string;
}

const DEFAULT_STATE: State = {
  version: 1,
  minecraftVersion: "25w45a",
  file: "net/minecraft/ChatFormatting.class"
};

const getInitialState = (): State => {
  const hash = window.location.hash;
  const path = hash.startsWith('#/') ? hash.slice(2) : (hash.startsWith('#') ? hash.slice(1) : '');
  const segments = path.split('/').filter(s => s.length > 0);

  if (segments.length < 3) {
    return DEFAULT_STATE;
  }

  const version = parseInt(segments[0], 10);
  const minecraftVersion = decodeURIComponent(segments[1]);
  const filePath = segments.slice(2).join('/');

  return {
    version,
    minecraftVersion,
    file: filePath + (filePath.endsWith('.class') ? '' : '.class')
  };
};

export const state = new BehaviorSubject<State>(getInitialState());
export const selectedFile = state.pipe(
  map(s => s.file)
);

state.subscribe(s => {
  const url = `#/${s.version}/${s.minecraftVersion}/${s.file.replace(".class", "")}`;
  window.history.replaceState({}, '', url);

  document.title = s.file.replace('.class', '');
});

export function setSelectedFile(file: string) {
  const currentState = state.getValue();
  state.next({
    ...currentState,
    file
  });
}