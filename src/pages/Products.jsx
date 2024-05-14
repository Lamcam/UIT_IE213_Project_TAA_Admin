import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'components/Common/Button1';
import DeleteConfirmationPopup from 'components/Common/DeleteConfirmationPopup';
import AddProduct from 'components/Products/AddProduct';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { GrAdd } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import 'styles/pages/Products.scss';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const title = "Xác nhận xóa sản phẩm";
    const body = "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không ?";
    const [searchKeyword, setSearchKeyword] = useState("");
    const fetchData = () => {
        axios.get('http://localhost:8000/products/cate')
            .then((res) => {
                const formattedData = res.data.map(item => ({
                    ...item,
                    currentPrice: formatPrice(item.prod_cost.$numberDecimal - (item.prod_discount.$numberDecimal * item.prod_cost.$numberDecimal)),
                    discount: (item.prod_discount.$numberDecimal * 100) + '%',
                    BeforDiscountPrice: formatPrice(item.prod_cost.$numberDecimal),
                    cate_name: item.cate_id.cate_name,
                    firstImageProduct: item.prod_img[0],
                }));
                setProducts(formattedData);
            })
            .catch((err) => {
                console.log(err);
            })
    };
    useEffect(() => {
        fetchData()
    }, []);
    const handleProductAdded = () => {
        fetchData();
    }

    const formatPrice = (price) => {
        const priceNumber = parseFloat(price);
        let formattedPrice = priceNumber.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
        return formattedPrice.trim();
    };

    const columns = [
        {
            field: 'prod_name',
            headerName: 'Tên sản phẩm',
            width: 250,
            cellClassName: 'body-large',
        },
        {
            field: 'firstImageProduct',
            headerName: 'Ảnh',
            width: 150,
            renderCell: (params) => (
                <img src={params.value} alt="First Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )
        },
        {
            field: 'currentPrice',
            headerName: 'Giá',
            width: 100,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'discount',
            headerName: 'Giảm giá(%)',
            width: 100,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'BeforDiscountPrice',
            headerName: 'Giá trước khi giảm',
            width: 150,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'prod_num_sold',
            headerName: 'Số lượng đã bán',
            width: 150,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'prod_num_avai',
            headerName: 'Số lượng còn lại',
            width: 150,
            cellClassName: 'content__center body-large',
        },
        {
            field: 'cate_name',
            headerName: 'Danh mục',
            width: 150,
            cellClassName: 'content__center body-large',
        },

    ];

    const handleDeleteConfirm = async () => {
        try {
            if (!selectedRows || selectedRows.length === 0) {
                console.error('No rows selected');
                return;
            }

            for (const id of selectedRows) {
                await axios.delete(`http://localhost:8000/products/${id}`);
                console.log(`Deleted product with id ${id}`);
            }

            // Sau khi xóa thành công, cập nhật lại danh sách sản phẩm
            axios.get('http://localhost:8000/products/cate')
                .then((res) => {
                    const formattedData = res.data.map(item => ({
                        ...item,
                        currentPrice: formatPrice(item.prod_cost.$numberDecimal - (item.prod_discount.$numberDecimal * item.prod_cost.$numberDecimal)),
                        discount: (item.prod_discount.$numberDecimal * 100) + '%',
                        BeforDiscountPrice: formatPrice(item.prod_cost.$numberDecimal),
                        cate_name: item.cate_id.cate_name,
                        firstImageProduct: item.prod_img[0],
                    }));
                    setProducts(formattedData); // Cập nhật products với dữ liệu mới
                })
                .catch((err) => {
                    console.error('Error fetching products:', err);
                });

            // Đóng popup xác nhận
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    // Hàm chuyển đổi chuỗi tiếng Việt có dấu thành chuỗi không dấu
    const removeDiacritics = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const filteredProducts = products.filter((item) => {
        const titleWithoutDiacritics = removeDiacritics(item.prod_name.toLowerCase());
        const keywordWithoutDiacritics = removeDiacritics(searchKeyword.toLowerCase());
        return titleWithoutDiacritics.includes(keywordWithoutDiacritics);
    });

    return (
        <Container id="ad_product">
            <div className="header__product">
                <div className="search__product">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                </div>
                <div className="add__delete_product">
                    <Button
                        label="Thêm sản phẩm"
                        icon={GrAdd}
                        labelColor="#F1EFE7"
                        backgroundColor="#785B5B"
                        onClick={() => setShowAddProduct(true)}
                    />
                    <AddProduct
                        show={showAddProduct}
                        onHide={() => setShowAddProduct(false)}
                        onProductAdded={handleProductAdded}
                    />
                    <Button
                        label="Xoá sản phẩm"
                        icon={MdDeleteOutline}
                        iconHeight="24px"
                        iconWidth="24px"
                        border={selectedRows.length > 0 ? "1px solid #ba1a1a" : 'none'}
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
            <div className='table_product'>
                <DataGrid
                    rows={filteredProducts}
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
                                return 'Chưa có sản phẩm nào được chọn';
                            } else {
                                return `${rowCount} sản phẩm được chọn`;
                            }
                        }
                    }}
                    pageSizeOptions={[5]}
                    onRowSelectionModelChange={(productSelection) => {
                        console.log(productSelection)
                        setSelectedRows(productSelection);
                    }}
                // localeText={{

                // }}
                />
            </div>
        </Container>
    );

}

export default Product;
