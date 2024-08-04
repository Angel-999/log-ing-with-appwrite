// JSON data
const data = {
    "total": 3,
    "documents": [
        {
            "Date": "2024-08-02T11:32:00.229+00:00",
            "Documents": [
                "https://ik.imagekit.io/7lvwoay0t/documents/W9",
                "https://ik.imagekit.io/7lvwoay0t/documents/W9",
                "https://ik.imagekit.io/7lvwoay0t/documents/W9"
            ],
            "RepairsPrice": 100,
            "Note": "Simple repair"
        },
        {
            "Date": "2024-07-02T13:29:28.274+00:00",
            "Documents": [
                "https://ik.imagekit.io/7lvwoay0t/documents/W9",
                "https://ik.imagekit.io/7lvwoay0t/documents/W9"
            ],
            "RepairsPrice": 599,
            "Note": "More expensive repair"
        },
        {
            "Date": "2024-08-02T13:29:28.274+00:00",
            "Documents": [
                "https://ik.imagekit.io/7lvwoay0t/documents/W9"
            ],
            "RepairsPrice": 69,
            "Note": "More affordable repair"
        }
    ]
};
// Helper function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// Column definitions
const columnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, suppressMovable: true, width: 40},
    { headerName: "Date", field: "Date", cellDataType: 'date', suppressMovable: true, filter: 'agDateColumnFilter', editable: true, cellRenderer: (params) => formatDate(params.value) },
    { headerName: "Repairs Price", field: "RepairsPrice", suppressMovable: true, filter: true, editable: true},
    { headerName: "Note", field: "Note" , suppressMovable: true, filter: true, editable: true},
    { headerName: "Documents", field: "Documents", suppressMovable: true, filter: true, cellRenderer: (params) => {
        return params.value.map(doc => `<a href="${doc}" target="_blank">${doc.replace("https://ik.imagekit.io/7lvwoay0t/documents/", "")}</a>`).join(', ');
    }}
];

// Grid options
const gridOptions = {
    columnDefs: columnDefs,
    rowData: data.documents,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    editType: 'fullRow'
};

// Setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
