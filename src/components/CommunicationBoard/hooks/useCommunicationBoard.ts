// import lotsOfStuff from "../../../../open-board-format/examples/lots_of_stuff.json";
import projectCore from "../../../open-board-format/examples/project-core.json";
import type { Board } from "../types";

export function useCommunicationBoard() {
  const board = projectCore as unknown as Board;
  return board;
}
