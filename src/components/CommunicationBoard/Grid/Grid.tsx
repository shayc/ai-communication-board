import classes from "./Grid.module.css";

export interface GridProps<TItem> {
  grid: TItem[][];
  renderCell: (item: TItem) => React.ReactNode;
  renderEmptyCell?: () => React.ReactNode;
}

export function Grid<TItem>(props: GridProps<TItem>) {
  const { grid, renderCell, renderEmptyCell } = props;

  return (
    <div className={classes.root}>
      {grid.map((row, rowIndex) => (
        <div className={classes.row} key={rowIndex}>
          {row.map((item, cellIndex) => (
            <div className={classes.cell} key={cellIndex}>
              {item ? renderCell(item) : renderEmptyCell?.()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
