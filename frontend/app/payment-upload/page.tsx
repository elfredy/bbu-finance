'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function PaymentUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'excel' | 'json' = 'excel') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/payments/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const unmatchedCount = response.data.unmatchedCount || 0;
      const skippedCount = response.data.skippedCount || 0;
      let messageText = `Başarılı! ${response.data.matchedCount} öğrenci eşleştirildi, ${response.data.totalPayments} ödeme kaydedildi.`;
      if (skippedCount > 0) {
        messageText += ` ${skippedCount} ödeme atlandı (duplicate BankUniqueId).`;
      }
      if (unmatchedCount > 0) {
        messageText += ` ${unmatchedCount} eşleşmeyen kayıt bulundu.`;
      }
      setMessage({
        type: 'success',
        text: messageText,
      });
      
      // 2 saniye sonra ödeme eden öğrenciler sayfasına yönlendir
      setTimeout(() => {
        router.push('/paid-students');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Dosya yüklenirken hata oluştu',
      });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Ana Sayfaya Dön
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ödəniş Dosyası Yüklə</h1>
          <p className="text-lg text-gray-600">Excel veya JSON dosyasında SENDER_DOCUMENT_DATA ile FIN eşleştirmesi yapılacak</p>
        </div>

        {/* Mesaj gösterimi */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Excel Dosya Yükleme */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">💳 Ödəniş Excel Dosyası</h2>
          <p className="text-sm text-gray-500 mb-4">
            Excel dosyasında <strong>SENDER_DOCUMENT_DATA</strong> kolonu FIN olarak kullanılacak ve <strong>amount</strong> kolonu ödəniş məbləği olarak kaydedilecek.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <strong>BANK_UNIQUE_ID</strong> kolonu varsa, aynı BankUniqueId ile daha önce kaydedilmiş ödemeler atlanacak (duplicate kontrolü).
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Aynı FIN için birden fazla ödeme varsa, toplam məbləğ hesaplanacak ve öğrencinin ödəniş məbləği güncellenecek.
          </p>
          
          <div>
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Yükleniyor...' : '📤 Excel Dosyası Seç və Yüklə'}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 'excel')}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* JSON Dosya Yükleme */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📄 Ödəniş JSON Dosyası</h2>
          <p className="text-sm text-gray-500 mb-4">
            JSON dosyasında <strong>SenderDocData</strong> alanı FIN olarak kullanılacak ve <strong>Amount</strong> alanı ödəniş məbləği olarak kaydedilecek.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <strong>BankUniqueId</strong> alanı varsa, aynı BankUniqueId ile daha önce kaydedilmiş ödemeler atlanacak (duplicate kontrolü).
          </p>
          <p className="text-sm text-gray-500 mb-6">
            JSON formatı: Array of objects with <code className="bg-gray-100 px-2 py-1 rounded">SenderDocData</code>, <code className="bg-gray-100 px-2 py-1 rounded">Amount</code>, <code className="bg-gray-100 px-2 py-1 rounded">PaymentDate</code>, <code className="bg-gray-100 px-2 py-1 rounded">BankUniqueId</code>, <code className="bg-gray-100 px-2 py-1 rounded">SenderName</code>
          </p>
          
          <div>
            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Yükleniyor...' : '📤 JSON Dosyası Seç və Yüklə'}
              <input
                type="file"
                accept=".json,.txt"
                onChange={(e) => handleFileUpload(e, 'json')}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

