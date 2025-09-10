import type { Board } from "../../components/CommunicationBoard/types";
import lotsOfStuff from "../../samples/lots_of_stuff.json";

export function useCommunicationBoard() {
  const board = lotsOfStuff as Board;
  return board;
}
