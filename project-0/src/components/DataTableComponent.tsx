import { useState, useEffect } from "react";
import { DataTable, DataTableStateEvent, DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataTableComponent = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);

  const fetchArtworks = async (pageNumber: number) => {
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}`
      );

      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      setAllArtworks((prev) => [...prev, ...data.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage]);

  const onPageChange = (e: DataTableStateEvent) => {
    const page = e.page ?? 0;
    setCurrentPage(page);
    fetchArtworks(page);
  };

  const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    setSelectedArtworks(e.value);
  };

  const handleSubmit = () => {
    if (rowCount > 0) {
      const selectedRows = allArtworks.slice(0, rowCount);
      setSelectedArtworks(selectedRows);
      setShowInput(false);
    }
  };

  const titleHeader = () => {
    return (
      <div>
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => setShowInput(!showInput)}
        >
          Title
        </span>
        {showInput && (
          <div style={{ display: "flex", marginTop: "5px" }}>
            <input
              type="number"
              placeholder="Enter rows"
              value={rowCount}
              onChange={(e) => setRowCount(parseInt(e.target.value) || 0)}
              style={{
                width: "80px",
                marginRight: "5px",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid black",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "4px 8px",
                border: "none",
                backgroundColor: "blue",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ margin: "20px" }}>
      <DataTable
        value={artworks}
        paginator
        paginatorPosition="both"
        rows={10}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        first={currentPage * 10}
        selectionMode="checkbox"
        selection={selectedArtworks}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        scrollable
        scrollHeight="flex"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "48px" }}
        ></Column>
        <Column
          field="title"
          header={titleHeader()}
          headerStyle={{ width: "400px" }}
        ></Column>
        <Column
          field="place_of_origin"
          header="Place of Origin"
          headerStyle={{ width: "200px" }}
        ></Column>
        <Column
          field="artist_display"
          header="Artist"
          headerStyle={{ width: "700px" }}
        ></Column>
        <Column
          field="date_start"
          header="Start Date"
          headerStyle={{ width: "150px" }}
        ></Column>
        <Column
          field="date_end"
          header="End Date"
          headerStyle={{ width: "150px" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default DataTableComponent;
