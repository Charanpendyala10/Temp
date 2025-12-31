import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setHeaders(jsonData[0]);
      setData(jsonData.slice(1));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Excel Viewer</h1>
        <p>Upload an Excel file to preview its contents</p>
      </header>

      <div className="upload-section">
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      </div>

      {data.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {headers.map((head, i) => (
                  <th key={i}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
