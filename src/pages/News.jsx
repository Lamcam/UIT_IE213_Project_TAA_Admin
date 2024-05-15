import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'components/Common/Button1';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { MdDeleteOutline } from 'react-icons/md';
import { GrAdd } from 'react-icons/gr';
import 'styles/pages/News.scss';
import DeleteConfirmationPopup from 'components/Common/DeleteConfirmationPopup';
import AddNew from 'components/News/AddNew';
import { MdEdit } from 'react-icons/md';
import EditNew from 'components/News/EditNew';

const News = () => {
    const [news, setNews] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const title = "Xác nhận xóa bài viết";
    const body = "Bạn có chắc chắn muốn xóa các bài viết đã chọn không ?";
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showAddNew, setShowAddNew] = useState(false);
    const [showEditNew, setShowEditNew] = useState(false);

    const fetchDataNews = () => {
        axios.get('http://localhost:8000/news')
            .then((res) => {
                const formattedData = res.data.map(item => ({
                    ...item,
                    firstImage: item.b_image[0],
                }));
                setNews(formattedData);
            })
            .catch((err) => {
                console.error('Error fetching news:', err);
            })
    }
    useEffect(() => {
        fetchDataNews()
    }, []);


    const handleNewAdded = () => {
        fetchDataNews();
    }

    const handleNewUpdated = () => {
        fetchDataNews();
    };
    const columns = [
        {
            field: 'b_title',
            headerName: 'Tiêu đề',
            width: 300,
            cellClassName: 'body-large',
        },
        {
            field: 'firstImage',
            headerName: 'Ảnh',
            width: 150,
            renderCell: (params) => (
                <img src={params.value} alt="First Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )
        },
        {
            field: 'b_date',
            headerName: 'Ngày đăng',
            width: 150,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'b_content',
            headerName: 'Nội dung',
            width: 500,
            cellClassName: 'body-large',
        },
    ];



    const handleDeleteConfirm = async () => {
        try {
            if (!selectedRows || selectedRows.length === 0) {
                console.error('No rows selected');
                return;
            }

            for (const id of selectedRows) {
                await axios.delete(`http://localhost:8000/news/${id}`);
                console.log(`Deleted news with id ${id}`);
            }

            // Sau khi xóa thành công, cập nhật lại danh sách bài viết
            axios.get('http://localhost:8000/news')
                .then((res) => {
                    const formattedData = res.data.map(item => ({
                        ...item,
                        firstImage: item.b_image[0],
                    }));
                    setNews(formattedData);
                })
                .catch((err) => {
                    console.error('Error fetching news:', err);
                });

            // Đóng popup xác nhận
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    // Hàm chuyển đổi chuỗi tiếng Việt có dấu thành chuỗi không dấu
    const removeDiacritics = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const filteredNews = news.filter((item) => {
        const titleWithoutDiacritics = removeDiacritics(item.b_title.toLowerCase());
        const keywordWithoutDiacritics = removeDiacritics(searchKeyword.toLowerCase());
        return titleWithoutDiacritics.includes(keywordWithoutDiacritics);
    });


    return (
        <Container id="ad_new">
            <div className="header__new">
                <div className="search__new">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                    />
                </div>
                <div className="add__delete_new">
                    <Button
                        label="Thêm Bài viết"
                        icon={GrAdd}
                        labelColor="#F1EFE7"
                        backgroundColor="#785B5B"
                        onClick={() => setShowAddNew(true)}
                    />
                    <AddNew
                        show={showAddNew}
                        onHide={() => setShowAddNew(false)}
                        onNewAdded={handleNewAdded}
                    />

                    <Button
                        label="Sửa"
                        icon={MdEdit}
                        iconHeight="24px"
                        iconWidth="24px"
                        border={selectedRows.length === 1 ? "1px solid #785B5B" : '1px solid #E3E3E4'}
                        labelColor={selectedRows.length === 1 ? "#F1EFE7" : "#999797"}
                        backgroundColor={selectedRows.length === 1 ? "#785B5B" : "#E3E3E4"}
                        onClick={() => {
                            if (selectedRows.length === 1) {
                                setShowEditNew(true);
                            }
                        }}
                    />
                    <EditNew
                        show={showEditNew}
                        onHide={() => setShowEditNew(false)}
                        onNewUpdated={handleNewUpdated}
                        newId={selectedRows}
                    />

                    <Button
                        label="Xoá"
                        icon={MdDeleteOutline}
                        iconHeight="24px"
                        iconWidth="24px"
                        border={selectedRows.length > 0 ? "1px solid #ba1a1a" : '1px solid #E3E3E4'}
                        labelColor={selectedRows.length > 0 ? "#F1EFE7" : "#999797"}
                        backgroundColor={selectedRows.length > 0 ? "#ba1a1a" : "#E3E3E4"}
                        onClick={() => {
                            if (selectedRows.length > 0) {
                                setShowDeletePopup(true);
                            }
                        }}
                    />
                    <DeleteConfirmationPopup
                        show={showDeletePopup}
                        onHide={() => setShowDeletePopup(false)}
                        onConfirm={handleDeleteConfirm}
                        title={title}
                        body={body}

                    />
                </div>
            </div>
            <div className='table_new'>
                <DataGrid
                    rows={filteredNews}
                    columns={columns}
                    autoHeight
                    rowHeight={120}
                    checkboxSelection
                    getRowId={(row) => row._id}
                    pagination
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    onRowSelectionModelChange={(newSelection) => {
                        console.log(newSelection)
                        setSelectedRows(newSelection);
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
                        noResultsOverlayLabel: 'Không có kết quả phù hợp',
                        noRowsLabel: 'Không có sản phẩm trùng với từ khóa',
                        footerRowSelected: (rowCount) => {
                            if (rowCount === 0) {
                                return 'Chưa có bài viết nào được chọn';
                            } else {
                                return `${rowCount} bài viết được chọn`;
                            }
                        }
                    }}
                />
            </div>
        </Container>
    );
}

export default News;
