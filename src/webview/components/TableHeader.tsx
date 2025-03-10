import React from "react";

export const TableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <thead>
      <tr className="border-b border-gray-700">
        {headers.map((header) => (
          <th key={header} className="p-2 text-left text-xs font-medium text-gray-400">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};
