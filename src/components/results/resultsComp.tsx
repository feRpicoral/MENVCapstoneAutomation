import React from 'react'
// import Grid from '@material-ui/core/Grid'
import { get_example_results } from '../../lib/fetch-results'
import { find_distribution } from '../../lib/find-capstones'
// import UserCard from '../../components/card'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export function ResultsComponent(props){

  var parsed_results = props.parsed_results
  const columns: GridColDef[] = [
    { field: 'capstone', headerName: 'Capstone', width: 250 },
    { field: 'student 1', headerName: 'Student 1', width: 130 },
    { field: 'student 2', headerName: 'Student 2', width: 130 },
    { field: 'student 3', headerName: 'Student 3', width: 130 },
    { field: 'student 4', headerName: 'Student 4', width: 130 }
  ];



  return (
      
      <div> 
        
        <h2> Statistics</h2>
        <div style={{ width: '45%'}}>
        
        <TableContainer component={Paper} >

          <Table sx={{ maxWidth: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Pref #</TableCell>
                <TableCell>1st </TableCell>
                <TableCell>2nd </TableCell>
                <TableCell>3rd </TableCell>
                <TableCell>4th </TableCell>
                <TableCell>5th </TableCell>
                <TableCell>None</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                  key={"values"}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell >
                  %
                </TableCell>

              {parsed_results.stats.map((item, ind) => (
                
                  <TableCell key = {ind} scope="row">
                    {`${item.toFixed(2)}%`}
                  </TableCell>
              ))}
              </ TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </div>

        
        <h2> Results </h2>        
        <div style={{ height: 400, width: '55%' }}>        
          <DataGrid
            initialState={{
              sorting: {
                sortModel: [{ field: 'capstone', sort: 'asc' }],
              },
            }}
            rows={parsed_results.results}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </div>



        <h2> Dropped Capstones </h2>

        <div>
          {parsed_results.dropped_capstones.length == 0 ? (
            <p>None</p>
          ) : (
              <div>
              {parsed_results.dropped_capstones.map((item, ind) => (
                  <div key = {ind}>
                    {`${item}`}
                  </div>
              ))}
              </div>
          )}
        </div>

      {/*{parsed_results} */}

      </div>
    )

}