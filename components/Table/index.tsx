import * as React from "react";
import { DataGrid, GridPageChangeParams } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-root": {
      padding: 10,
    },
  }
});

export default function TableComponent(props:any) {
  const classes = useStyles();
  const [pageSize, setPageSize] = React.useState<number>(15);
  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize);
  };
  return (
    <div style={{ height: 500, width: "100%" }} className={classes.root}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={[10, 15, 20]}
        onRowSelected={props.handleRowSelection}
        columnBuffer={props.columns.length}
        rowHeight={props.rowHeight}
      />
    </div>
  );
}
