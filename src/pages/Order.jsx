import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "date_time",
    headerName: "Ngày đặt hàng",
    width: 150,
    editable: true,
  },
  {
    field: "cost",
    headerName: "Giá trị đơn hàngr",
    width: 150,
    editable: true,
  },
  {
    field: "user_name",
    headerName: "Người đặt hàng",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "prod_name",
    headerName: "Tên sản phẩm",
    sortable: true,
    width: 160,
  },
];

const createData = (info) => {
  const temp = info.map((item) => {
    return {
      id: item._id,
      date_time: item.order_id.order_datetime,
      cost: item.order_id.order_total_cost.$numberDecimal,
      user_name: item.order_id.user_id.user_name,
      prod_name: item.prod_id.prod_name,
      quanity: item.quantity,
      status: item.order_id.order_status,
    };
  });
  return temp;
};

const Order = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/order/orderdetail")
      .then((res) => {
        setData(createData(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 11,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default Order;
