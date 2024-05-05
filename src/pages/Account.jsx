import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
const columns = [
  { field: '_id', headerName: 'ID', width: 220},
  {
    field: 'user_name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'user_phone',
    headerName: 'Phone',
    width: 150,
    editable: true,
  },
  {
    field: 'user_email',
    headerName: 'Email',
    type: 'number',
    width: 160,
    editable: true,
  },
  {
    field: 'user_cccd',
    headerName: 'CCCD',
    sortable: false,
    width: 160,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Account = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/user/')
        .then((res) => {
            setData(res.data);
        }).then(() => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
          />
        </Box>
      );
}

export default Account;