import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import ModalUpdateOrder from "components/Modal/AdjustOrder";
import axios from "axios";
import { IoPencilSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import Button from "components/Common/Button1";
import 'styles/pages/Order.scss'

const columns = [
  { field: "id", headerName: "Mã đơn hàng", width: 100, headerAlign: 'center', headerClassName: 'col_order', cellClassName: 'cell_order' },
  {
    field: "date_time",
    headerName: "Ngày đặt hàng",
    width: 150,
    editable: true,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
    
  },
  {
    field: "cost",
    headerName: "Giá trị đơn hàng",
    width: 150,
    editable: true,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
  {
    field: "user_name",
    headerName: "Người đặt hàng",
    type: "number",
    width: 110,
    editable: true,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
  {
    field: "prod_name",
    headerName: "Tên sản phẩm",
    sortable: true,
    width: 150,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
  {
    field: "quanity",
    headerName: "Số lượng",
    type: "number",
    sortable: true,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
  {
    field: "order_is_paying",
    headerName: "Trạng thái thanh toán",
    type: "dropdown",
    sortable: true,
    editable: true,
    headerAlign: 'center',
    width: 160,
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
  {
    field: "order_status",
    headerName: "Trạng thái đơn hàng",
    sortable: true,
    editable: true,
    width: 160,
    headerAlign: 'center',
    headerClassName: 'col_order',
    cellClassName: 'cell_order',
  },
];

const formatMoney = (amount) => {
  amount = amount.split(".")[0];
  amount = amount.toString().replace();
  const parts = amount.toString().split(".");
  const formattedAmount =
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
    (parts[1] ? `.${parts[1]}` : "");
  return formattedAmount + " VNĐ";
};
const formatDateTime = (date) => {
  const dateObject = new Date(date).toLocaleString();
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  const formattedDate = dateObject.toLocaleString("en-GB", options);
  const final = formattedDate.split(",")[0]
  return final;
  // return formattedDate;
};

const createData = (info) => {
  const temp = info.map((item) => {
    let name = "Khách vãng lai";
    if (item.order_id.user_id) {
      name = item.order_id.user_id.user_name;
    }
    return {
      id: item._id,
      date_time: formatDateTime(item.order_id.order_datetime),
      cost: formatMoney(item.order_id.order_total_cost.$numberDecimal),
      user_name: name,
      prod_name: item.prod_id.prod_name,
      quanity: item.quantity,
      status: item.order_id.order_status,
      order_is_paying: item.order_id.order_is_paying
        ? "Đã thanh toán"
        : "Chưa thanh toán",
      order_status: item.order_id.order_status
        ? "Đã giao hàng"
        : "Chưa giao hàng",
    };
  });
  return temp;
};


const Order = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [paying, setPaying] = useState(0);
  const [status, setStatus] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:8000/order/orderdetail")
      .then((res) => {
        setData(createData(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  const updateValue = (item) => {
    const update = data.find((e) => e.id === item._id);
    console.log(item);
    console.log(update);
    if(update){
      update.order_is_paying = item.order_is_paying === 0 ? "Chưa thanh toán" : "Đã thanh toán";
      update.order_status = item.order_status === 0 ? "Chưa giao hàng" : "Đã giao hàng";
      setData([...data]);
    }
  }

  const setValue = (Selection, data) => {
    if (Selection.length > 0) {
      setSelectedOrder(data.find((e) => e.id === Selection[0]));
      setSelectedRows(Selection);
      setPaying(data.find((e) => e.id === Selection[0]).order_is_paying);
      setStatus(data.find((e) => e.id === Selection[0]).order_status);
    } else {
      setSelectedOrder(0);
      setSelectedRows(0);
      setPaying("Chưa giao hàng");
      setStatus("Chưa thanh toán");
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }} >
      <Button
        label="Sửa đơn hàng"
        icon={IoPencilSharp}
        iconHeight="24px"
        iconWidth="24px"
        border={selectedRows.length > 0 ? "1px solid #ba1a1a" : "none"}
        labelColor={selectedRows.length > 0 ? "#F1EFE7" : "#999797"}
        backgroundColor={selectedRows.length > 0 ? "#ba1a1a" : "#E3E3E4"}
        onClick={() => {
          if (selectedRows.length > 0) {
            setModalShow(true);
          }
        }}
      />

      <ModalUpdateOrder
        id={selectedOrder?.id}
        paying={paying}
        status={status}
        show={modalShow}
        updateValue={updateValue}
        onHide={() => setModalShow(false)}
      />
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        pagination
        autoWidth
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 11,
            },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        localeText={{
          toolbarFilters: "Bộ lọc",
          toolbarColumns: "Cột",
          toolbarColumnsLabel: "Chọn cột",
          toolbarExport: "Xuất",
          toolbarExportLabel: "Xuất",
          toolbarExportCSV: "Xuất sang CSV",
          toolbarExportPrint: "In",
          toolbarExportExcel: "Tải Excel",
          columnsManagementSearchTitle: "Tìm kiếm",
          columnsManagementNoColumns: "Không có cột nào được hiển thị",
          columnsManagementShowHideAllText: "Hiển thị/Ẩn tất cả",
          columnsManagementReset: "Đặt lại",
          toolbarDensity: "Độ dày",
          toolbarDensityLabel: "Độ dày",
          toolbarDensityCompact: "Sát",
          toolbarDensityStandard: "Chuẩn",
          toolbarDensityComfortable: "Rộng",
          filterPanelAddFilter: "Thêm bộ lọc",
          filterPanelDeleteIconLabel: "Xóa",
          filterPanelLinkOperator: "Toán tử logic",
          filterPanelOperator: "Toán tử", // TODO v6: rename to filterPanelOperator
          filterPanelOperatorAnd: "Và",
          filterPanelOperatorOr: "Hoặc",
          filterPanelColumns: "Cột",
          filterPanelInputLabel: "Giá trị",
          filterPanelInputPlaceholder: "Giá trị bộ lọc",
          filterOperatorContains: "chứa",
          filterOperatorEquals: "bằng",
          filterOperatorStartsWith: "bắt đầu với",
          filterOperatorEndsWith: "kết thúc với",
          filterOperatorIs: "là",
          filterOperatorNot: "không là",
          filterOperatorAfter: "sau",
          filterOperatorOnOrAfter: "vào hoặc sau",
          filterOperatorBefore: "trước",
          filterOperatorOnOrBefore: "vào hoặc trước",
          filterOperatorIsEmpty: "trống",
          filterOperatorIsNotEmpty: "không trống",
          filterOperatorIsAnyOf: "bất kỳ trong số",
        }}
        loading={data.length === 0}
        pageSizeOptions={[5]}
        checkboxSelection
        disableMultipleRowSelection={true}
        disableRowSelectionOnClick
        // onRowSelectionModelChange={(Selection) => {
        //   setSelectedOrder(data.find((e) => e.id === Selection[0]));
        //   setSelectedRows(Selection);
        //   setPaying(data.find((e) => e.id === Selection[0]).order_is_paying);
        //   setStatus(data.find((e) => e.id === Selection[0]).order_status);}}
        onRowSelectionModelChange={(Selection) => setValue(Selection, data)}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default Order;
