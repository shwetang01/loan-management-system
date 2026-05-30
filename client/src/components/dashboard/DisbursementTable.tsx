'use client';

import React from 'react';
import Badge from '../ui/Badge';

export default function DisbursementTable() {
  const dummyLoans = [
    { id: '1', appNo: 'LMS-2026-M4K9L', borrower: 'Eleanor Shellstrop', sanctioned: 20000, rate: '10.5%', tenure: '24m' },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <th className="p-3">App Number</th>
            <th className="p-3">Borrower</th>
            <th className="p-3">Sanctioned Amount</th>
            <th className="p-3">Rate / Tenure</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y">
          {dummyLoans.map((loan) => (
            <tr key={loan.id} className="hover:bg-slate-50/50">
              <td className="p-3 font-semibold text-slate-700">{loan.appNo}</td>
              <td className="p-3">{loan.borrower}</td>
              <td className="p-3">${loan.sanctioned.toLocaleString()}</td>
              <td className="p-3 text-slate-600">{loan.rate} @ {loan.tenure}</td>
              <td className="p-3">
                <Badge variant="warning">Awaiting Disbursal</Badge>
              </td>
              <td className="p-3 text-right">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                  Disburse & Generate Schedule
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
