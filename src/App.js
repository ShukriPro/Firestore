import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import db from "./firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

function App() {
  const [narumiData, setNarumiData] = useState([]);
  const [marinaData, setMarinaData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const narumiDocs = await getDocs(collection(db, "narumi"));
      const marinaDocs = await getDocs(collection(db, "marina"));

      const formatData = (docs) =>
        docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            formattedTimestamp: new Date(doc.data().timestamp.seconds * 1000).toLocaleString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric", // Include seconds in the format
                hour12: true,
              }
            ),
          }))
          .sort(
            (a, b) =>
              b.timestamp.seconds - a.timestamp.seconds || b.timestamp.nanoseconds - a.timestamp.nanoseconds
          );

      setNarumiData(formatData(narumiDocs.docs));
      setMarinaData(formatData(marinaDocs.docs));
    };

    fetchData();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (data, isChecked) => {
    const ids = data.map((item) => item.id);
    setSelectedIds((prev) =>
      isChecked
        ? [...new Set([...prev, ...ids])]
        : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleDeleteSelected = async (collectionName, data) => {
    const idsToDelete = selectedIds.filter((id) =>
      data.some((item) => item.id === id)
    );
    try {
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, collectionName, id));
      }
      setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
      if (collectionName === "narumi") {
        setNarumiData((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
      } else if (collectionName === "marina") {
        setMarinaData((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
      }
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Data from Firestore</h1>

      {/* Narumi Group */}
      <div className="mb-4">
        <h3>Narumi</h3>
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={(e) => handleSelectAll(narumiData, e.target.checked)}
          />
          <label className="form-check-label">Select All</label>
        </div>
        <ul className="list-group">
          {narumiData.map((item) => (
            <li key={item.id} className="list-group-item">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleSelect(item.id)}
              />
              <strong>Date:</strong> {item.formattedTimestamp}
            </li>
          ))}
        </ul>
        <button
          className="btn btn-danger mt-3"
          onClick={() => handleDeleteSelected("narumi", narumiData)}
        >
          Delete Selected
        </button>
      </div>

      {/* Marina Group */}
      <div>
        <h3>Marina</h3>
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={(e) => handleSelectAll(marinaData, e.target.checked)}
          />
          <label className="form-check-label">Select All</label>
        </div>
        <ul className="list-group">
          {marinaData.map((item) => (
            <li key={item.id} className="list-group-item">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleSelect(item.id)}
              />
              <strong>Date:</strong> {item.formattedTimestamp}
            </li>
          ))}
        </ul>
        <button
          className="btn btn-danger mt-3"
          onClick={() => handleDeleteSelected("marina", marinaData)}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}

export default App;
