import React from 'react';
import './Table.css';

const Table = ({ columns, data }) => {
    if (!columns || !data) {
        return <div className="p-4 text-center text-gray-500">No data available</div>;
    }

    return (
        <div className="table-wrapper p-4">
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={column.cellClassName || ''}>
                                        {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
