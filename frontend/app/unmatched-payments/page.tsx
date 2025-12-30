'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

interface UnmatchedPayment {
  id: number;
  fin: string | null;
  senderName: string | null;
  amount: number;
  paymentDate: string | null;
  paymentData: any;
  createdAt: string;
}

export default function UnmatchedPaymentsPage() {
  const [payments, setPayments] = useState<UnmatchedPayment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnmatchedPayments();
  }, []);

  const loadUnmatchedPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get<UnmatchedPayment[]>(`${API_BASE_URL}/api/unmatched-payments`);
      setPayments(response.data);
    } catch (error) {
      console.error('Eşleşmeyen ödemeler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bakı Biznes Universiteti
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Eşleşməyən Ödənişlər
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              📚 Bütün Tələbələr
            </Link>
            <Link
              href="/paid-students"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              💰 Ödəniş Edən Tələbələr
            </Link>
            <Link
              href="/payment-upload"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              💳 Ödəniş Dosyası Yüklə
            </Link>
          </div>
        </div>

        {/* Info Card */}
        {payments.length > 0 && (
          <div className="bg-red-600 text-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">⚠️ Eşleşməyən Ödənişlər</h2>
                <p className="text-red-100">
                  <strong className="text-white">{payments.length.toLocaleString('az-AZ')}</strong> ödəniş eşleşməyib
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        )}

        {/* Ödeme Listesi */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4">Yüklənir...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            <p className="text-lg">Eşleşməyən ödəniş tapılmadı.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">📋 Eşleşməyən Ödəniş Siyahısı</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      FIN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Göndərən Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Məbləğ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tarix
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.fin || <span className="text-red-600">FIN yoxdur</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.senderName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {Number(payment.amount).toFixed(2)} ₼
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('az-AZ') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

