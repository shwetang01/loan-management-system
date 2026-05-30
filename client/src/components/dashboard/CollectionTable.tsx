'use client';

import React from 'react';
import Badge from '../ui/Badge';

export default function CollectionTable() {
  const dummyEMIInstallments = [
    { id: '1', appNo: 'LMS-2026-X1Y2Z', borrower: 'Tahani Al-Jamil', emi: 450.5, dueDate: '2026-06-15', status: 'pending' },
    { id: '2', appNo: 'LMS-2026-A9B8C', borrower: 'Chidi Anagonye', emi: 620.0, dueDate: '2026-05-15', status: 'overdue' },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <th className="p-3">App Number</th>
            <th className="p-3">Borrower</th>
            <th className="p-3">EMI Amount</th>
            <th className="p-3">Due Date</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Payment</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y">
          {dummyEMIInstallments.map((inst) => (
            <tr key={inst.id} className="hover:bg-slate-50/50">
              <td className="p-3 font-semibold text-slate-700">{inst.appNo}</td>
              <td className="p-3">{inst.borrower}</td>
              <td className="p-3">${inst.emi.toFixed(2)}</td>
              <td className="p-3 text-slate-600">{inst.dueDate}</td>
              <td className="p-3">
                <Badge variant={inst.status === 'overdue' ? 'error' : 'warning'}>
                  {inst.status}
                </Badge>
              </td>
              <td className="p-3 text-right">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                  Record Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
