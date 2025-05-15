// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Table from './Table';
import './App'

function App() {
  const [currentTable, setCurrentTable] = useState([]);
  const [previousTable, setPreviousTable] = useState([]);
  const [differences, setDifferences] = useState([]);
  const [titleBtn, setTitleBtn] = useState('Import Excel File');
  const inputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const oldData = JSON.parse(localStorage.getItem('dataTable')) || [];
      setPreviousTable(oldData);
      setCurrentTable(jsonData);
      localStorage.setItem('dataTable', JSON.stringify(jsonData));
      setDifferences(compareTables(oldData, jsonData));
    };
    e.target.value = null;
    reader.readAsArrayBuffer(file);
    setTitleBtn('Import and Analyze');
  };

  const compareTables = (oldData, newData) => {
    const diffs = [];
    const maxLength = Math.max(oldData.length, newData.length);

    for (let i = 0; i < maxLength; i++) {
      const oldRow = oldData[i] || {};
      const newRow = newData[i] || {};
      const rowDiff = {};

      const allKeys = new Set([...Object.keys(oldRow), ...Object.keys(newRow)]);

      allKeys.forEach((key) => {
        const oldValue = oldRow[key] ?? '';
        const newValue = newRow[key] ?? '';
        if (oldValue !== newValue) {
          rowDiff[key] = { old: oldValue, new: newValue };
        }
      });

      if (Object.keys(rowDiff).length > 0) {
        diffs.push({ rowIndex: i, changes: rowDiff });
      }
    }
    return diffs;
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    const dataTableFromLocalStorage = localStorage.getItem('dataTable');
    if (dataTableFromLocalStorage) {
      const parsed = JSON.parse(dataTableFromLocalStorage);
      setCurrentTable(parsed);
      setPreviousTable(parsed);
      setTitleBtn('Import and Analyze');
    }
  }, []);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h3 className="cursor-pointer" onClick={handleClick}>
        {titleBtn}
      </h3>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Table data={currentTable} differences={differences} />
    </div>
  );
}

export default App;
