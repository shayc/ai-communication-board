export interface Grid {
  rows: number;
  columns: number;
  order?: (string | null)[][];
}

export interface Button {
  id: string;
  label: string;
  vocalization?: string;
  action?: string;
  actions?: string[];
}

export interface Board {
  id: string;
  name: string;
  buttons: Button[];
  grid: Grid;
}
