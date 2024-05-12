import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Button from "components/Common/Button1";
import axios from "axios";
import { useEffect, useState } from "react";
import { GrAdd } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import 'styles/pages/Account.scss';

const columns = [
  { field: "_id", headerName: "ID", width: 220, headerAlign: 'center', headerClassName: 'col_account', },
  {
    field: "user_name",
    headerName: "Tên tài khoản",
    width: 250,
    editable: true,
    headerAlign: 'center', headerClassName: 'col_account',
  },
  {
    field: "user_phone",
    headerName: "Số điện thoại",
    width: 250,
    editable: true,
    headerAlign: 'center', headerClassName: 'col_account',
  },
  {
    field: "user_email",
    headerName: "Email",
    type: "number",
    width: 200,
    editable: true,
    headerAlign: 'center', headerClassName: 'col_account',
  },
  {
    field: "user_cccd",
    headerName: "CCCD",
    sortable: false,
    width: 230,
    headerAlign: 'center', headerClassName: 'col_account',
  },
];

const Account = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/user/")
      .then((res) => {
        setData(res.data);
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
        autoHeight
        autoWidth
        pagination
        loading={data.length === 0}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
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
          noRowsLabel: "Không có tài khoản tìm thấy nào ",
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        getRowId={(row) => row._id}
        disableMultipleRowSelection={true}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(Selection) => {
          setSelectedAccount(data.find((e) => e._id === Selection[0]));
          setSelectedRows(Selection);
        }}
        
      />
    </Box>
  );
};

export default Account;
