import { getUserData, avatars, logout, roles, databases, storage } from './appwrite.js';
import { Notyf } from 'notyf';
const notyf = new Notyf({
    duration: 2500,
    position: {
        x: 'right',
        y: 'bottom',
    }
});
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id'); // Ensure URL has ?id=(ID)
var globalGridOptions = {
    
}
const editModal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const dateInput = document.getElementById('date');
const noteInput = document.getElementById('note');
const documentInput = document.getElementById('document');
const saveButton = document.getElementById('saveButton');
const closeButton = document.getElementById('closeButton');
const editForm = document.getElementById('editForm');
document.addEventListener('DOMContentLoaded', () => {
    Initialize();
    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', openEditModal);
})
async function Initialize() {
    const data = await getInspections();
    await renderGrid(data);
    
}
function renderGrid(data) {
    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, suppressMovable: true, width: 40 },
        { 
            headerName: "Date", 
            field: "Date", 
            suppressMovable: true,
            sortable: true, 
            filter: 'agDateColumnFilter', 
            valueFormatter: dateFormatter,
            filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                    // Parse the cell value to remove the time part
                    const cellDate = new Date(cellValue);
                    const cellDateWithoutTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
                    
                    // Compare only the date part
                    if (filterLocalDateAtMidnight.getTime() === cellDateWithoutTime.getTime()) {
                        return 0;
                    }
                    if (cellDateWithoutTime < filterLocalDateAtMidnight) {
                        return -1;
                    }
                    if (cellDateWithoutTime > filterLocalDateAtMidnight) {
                        return 1;
                    }
                }
            }
        },
        { headerName: "Note", field: "Note", sortable: false, filter: true, suppressMovable: true, },
        {
            headerName: "Document",
            field: "Document",
            sortable: false,
            suppressMovable: true,
            cellRenderer: function (params) {
                if (params.value) {
                    return `<a href="${params.value}" target="_blank" style="color: var(--primary); text-decoration: underline; padding: 5px 20px;"><i class="fa-solid fa-eye" style="margin-right: 10px;"></i>View</a>`;
                } else {
                    return "No Document";
                }
            }
        }
    ];
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowSelection: 'multiple',
        suppressDragLeaveHidesColumns: true,
        editType: 'fullRow'
    };
    globalGridOptions = gridOptions;
    const eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
}
function dateFormatter(params) {
    if (params.value) {
        const date = new Date(params.value);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options); // Use abbreviated month
    }
    return null;
}
async function getInspections() {
    // Function to fetch inspections by truck ID
    if (!id) {
        notyf.error("No ID provided");
        return null;
    }
    try {
        const response = await databases.getDocument(
            'tst', // databaseId
            '669cbcd30006ae923e3c', // collectionId
            id  // documentId
        );
        return response.inspection;
        
    } catch (error) {
        notyf.error("Error loading inspections: " + error.message);
    }
}
function openEditModal(){
    const selectedRows = globalGridOptions.api.getSelectedRows();
        
    if (selectedRows.length === 0) {
        notyf.error('Please select a row to edit.');
        return;
    }

    const row = selectedRows[0];
    modalTitle.textContent = "Edit Inspection";
    dateInput.value = row.Date.split('T')[0]; // Assuming the Date field is in ISO format
    noteInput.value = row.Note || '';
    documentInput.value = row.Document || '';
    
    editModal.showModal();
}