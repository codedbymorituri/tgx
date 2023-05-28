console.log("tgx is running..."); //

let searchRazorObject;
let filterRazorObject;
let dataGridRazorObject;
let limitPagesCheckboxElement;
let maxSearchPagesElement;
let categoryFilterElement;
let uploaderFilterElement;
let tableContainerElement;
let tableBodyElement;
let statusTextElement;
let overlayElement;

let maxPagesToSearch;
let selectedElement = null;

function setSearchRazorObject(razorObject) {
    searchRazorObject = razorObject;
}

function setFilterRazorObject(razorObject) {
    filterRazorObject = razorObject;
}

function setDataGridRazorObject(razorObject) {
    dataGridRazorObject = razorObject;
}

function setSearchTextElement(searchTextElement) {
    searchTextElement.addEventListener("keyup", async function (e) {
        if (e.key === "Enter") {
           await handleSearch();
        }
    });
}

function setSearchButtonElement(searchButtonElement) {
    searchButtonElement.addEventListener("click", async function (e) {
        await handleSearch();
    });
}

function setMagnetButtonElement(magnetButtonElement) {
    magnetButtonElement.addEventListener("click", async function (e) {
        if (selectedElement === null) {
            updateStatusText("Nothing selected");
        }
        else {
            const magnet = getMagnet();
            updateStatusText(magnet);
            navigator.clipboard.writeText(magnet);
        }
    });
}

function setFilterTextElement(filterTextElement) {
    filterTextElement.addEventListener("keyup", async function (e) {
        if (e.key === "Enter") {
            handleFilter();
        }
    });
}

function setFilterButtonElement(filterButtonElement) {
    filterButtonElement.addEventListener("click", async function (e) {
        handleFilter();
    });
}

function setLimitPagesCheckBoxElement(limitCheckBoxElement) {
    limitPagesCheckboxElement = limitCheckBoxElement;
}

function setMaxSearchPagesElement(maxPagesElement) {
    maxSearchPagesElement = maxPagesElement;
}

function setCategoryFilterElement(filterElement) {
    categoryFilterElement = filterElement;
}

function setUploaderFilterElement(filterElement) {
    uploaderFilterElement = filterElement;
}

function setTableContainerElement(tableElement) {
    tableContainerElement = tableElement;
}

function setTableBodyElement(bodyElement) {
    tableBodyElement = bodyElement;
}

function setStatusTextElement(statusElement) {
    statusTextElement = statusElement;
}

function setOverlayElement(element) {
    overlayElement = element;
    toggleOverlay();
}

async function handleSearch() {
    toggleOverlay();
    validateMaxPagesToSearch();
    searchResults = await searchRazorObject.invokeMethodAsync("HandleSearch");

    if (searchResults === null) {
        toggleOverlay();
        return;
    }

    removeChildElements(tableBodyElement, true);
    searchResults["searchResults"].forEach(function (searchResult) {
        addSearchResult(searchResult);
    });

    removeChildElements(categoryFilterElement);
    searchResults["categoryFilters"].forEach(function (categoryFilter) {
        addFilter(categoryFilterElement, categoryFilter);
    });

    removeChildElements(uploaderFilterElement);
    searchResults["uploaderFilters"].forEach(function (uploaderFilter) {
        addFilter(uploaderFilterElement, uploaderFilter);
    });

    selectedElement = null;
    updateStatusText(`Showing ${searchResults["searchResults"].length} search results`)
    toggleOverlay();
}

function addSearchResult(result) {
    const tableRow = document.createElement("div");
    tableRow.classList.add("table-row");
    addElementClickedEventHandler(tableRow);
    Object.keys(result).forEach((key) => {
        const tableData = document.createElement("div");
        tableData.innerHTML = result[key];
        tableData.classList.add("table-cell");
        switch (key) {
            case "category":
                tableData.classList.add("category");
                break;
            case "title":
                tableData.classList.add("title");
                break;
            case "added":
                tableData.classList.add("added");
                break;
            case "size":
                tableData.classList.add("size");
                break;
            case "seeders":
                tableData.classList.add("seeders");
                break;
            case "leechers":
                tableData.classList.add("leechers");
                break;
            case "uploader":
                tableData.classList.add("uploader");
                break;
            case "link":
                tableData.classList.add("hidden");
                break;
            case "magnet":
                tableData.classList.add("hidden");
                break;
            default:
        }
        tableRow.appendChild(tableData);
    });
    tableBodyElement.appendChild(tableRow);
}

function handleFilter() {
    filterRazorObject.invokeMethod("HandleFilter");
}

function showFilteredResults(filteredResults) {
    removeChildElements(tableBodyElement);
    filteredResults.forEach(function (filteredResult) {
        addSearchResult(filteredResult);
    });
    selectedElement = null;
    updateStatusText(`Showing ${filteredResults.length} search results`)
}

function addFilter(parentElement, filter) {
    const option = document.createElement("option");
    option.innerHTML = filter;
    parentElement.appendChild(option);
}

function removeChildElements(parentElement, hasListener = false) {
    while (parentElement.firstChild) {
        if (hasListener) {
            removeElementClickedHandler(parentElement.firstChild);
        }
        parentElement.removeChild(parentElement.firstChild);
    }
}

function validateMaxPagesToSearch() {
    if (limitPagesCheckboxElement.checked) {
        getMaxPagesToSearch();
    }
    else {
        maxPagesToSearch = 5;
    }
}

function getMaxPagesToSearch() {
    const value = maxSearchPagesElement.value;
    maxPagesToSearch = parseInt(value);
    if (!Number.isInteger(maxPagesToSearch) || maxPagesToSearch < 1) {
        maxPagesToSearch = 1;
    }
    else if (maxPagesToSearch > 5) {
        maxPagesToSearch = 5;
    }
    maxSearchPagesElement.value = maxPagesToSearch;
}

function addElementClickedEventHandler(element) {
    element.addEventListener("click", handleElementClicked);
}

function removeElementClickedHandler(element) {
    element.removeEventListener("click", handleElementClicked);
}

function handleElementClicked(e) {
    e.stopPropagation();
    removeHighlight();
    selectedElement = e.target.parentNode;
    selectedElement.classList.add("highlight");
    updateStatusText(getLink());
}

function getLink() {
    const selectedRow = selectedElement.querySelectorAll("div");
    return selectedRow[selectedRow.length - 2].textContent;
}

function getMagnet() {
    const selectedRow = selectedElement.querySelectorAll("div");
    return selectedRow[selectedRow.length - 1].textContent;
}

function removeHighlight() {
    const highlightElements = tableContainerElement.querySelectorAll(".highlight");
    highlightElements.forEach(element => {
        element.classList.remove("highlight");
    });
}

function toggleOverlay() {
    overlayElement.classList.toggle("overlay");
}

function updateStatusText(text) {
    statusTextElement.innerHTML = text;
}
