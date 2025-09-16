import type { Board } from "../../components/CommunicationBoard/types";
import lotsOfStuff from "../../open-board-format/examples/lots_of_stuff.json";

export function useCommunicationBoard() {
  const board = lotsOfStuff as Board;
  return board;
}
