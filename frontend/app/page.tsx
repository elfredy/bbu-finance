'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

interface Student {
  id: number;
  fin: string;
  adSoyad: string | null;
  kurs: string | null;
  qrup: string | null;
  fakulte: string | null;
  ixtisas: string | null;
  qebulIli: string | null;
  odemisMeblegi: number | null;
  illik: string | null;
}

interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: string;
}

interface StudentsResponse {
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FilterOptions {
  kurs: string[];
  qrup: string[];
  fakulte: string[];
  qebulIli: string[];
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    kurs: [],
    qrup: [],
    fakulte: [],
    qebulIli: [],
  });
  const [filters, setFilters] = useState({
    kurs: '',
    qrup: '',
    fakulte: '',
    qebulIli: '',
    fin: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [paymentsMap, setPaymentsMap] = useState<Map<number, Payment[]>>(new Map());

  // Borc ve əlavə ödəniş hesaplama fonksiyonu
  const calculateDebtAndExtra = (odemisMeblegi: number | null, illik: string | null) => {
    const odemis = odemisMeblegi || 0;
    const illikValue = illik ? parseFloat(illik) : 0;
    
    let borc = 0;
    let elaveOdemis = 0;
    
    if (odemis < illikValue) {
      borc = illikValue - odemis;
    } else if (odemis > illikValue) {
      elaveOdemis = odemis - illikValue;
    }
    
    return { borc, elaveOdemis };
  };

  // Toplam illik ve toplam borç hesaplama
  const calculateTotals = () => {
    let totalIllik = 0;
    let totalBorc = 0;
    
    students.forEach((student) => {
      const illikValue = student.illik ? parseFloat(student.illik) : 0;
      totalIllik += illikValue;
      
      const { borc } = calculateDebtAndExtra(student.odemisMeblegi, student.illik);
      totalBorc += borc;
    });
    
    return { totalIllik, totalBorc };
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters]);

  const loadFilterOptions = async () => {
    try {
      const response = await axios.get<FilterOptions>(`${API_BASE_URL}/api/students/filter-options`);
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Filtre seçenekleri alınamadı:', error);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.kurs) params.append('kurs', filters.kurs);
      if (filters.qrup) params.append('qrup', filters.qrup);
      if (filters.fakulte) params.append('fakulte', filters.fakulte);
      if (filters.qebulIli) params.append('qebulIli', filters.qebulIli);
      if (filters.fin) params.append('fin', filters.fin);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await axios.get<StudentsResponse>(`${API_BASE_URL}/api/students?${params.toString()}`);
      
      setStudents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Tələbələr yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      kurs: '',
      qrup: '',
      fakulte: '',
      qebulIli: '',
      fin: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const toggleRowExpansion = async (studentId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
      // Eğer payment'lar yüklenmemişse yükle
      if (!paymentsMap.has(studentId)) {
        try {
          const response = await axios.get<Payment[]>(`${API_BASE_URL}/api/students/${studentId}/payments`);
          setPaymentsMap(prev => new Map(prev).set(studentId, response.data));
        } catch (error) {
          console.error('Payment detayları yüklenemedi:', error);
        }
      }
    }
    setExpandedRows(newExpanded);
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
            Tələbə Məlumatları
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/paid-students"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              💰 Ödəniş Edən Tələbələr
            </Link>
            <Link
              href="/admin"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              ⚙️ Admin Paneli
            </Link>
            <Link
              href="/payment-upload"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              💳 Ödəniş Dosyası Yüklə
            </Link>
            <Link
              href="/unmatched-payments"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              ⚠️ Eşleşməyən Ödənişlər
            </Link>
          </div>
        </div>

        {/* Info Card */}
        {pagination.total > 0 && (() => {
          // Tüm öğrenciler için toplam hesaplama (backend'den alınacak, şimdilik sayfalı veri için)
          const allStudents = students;
          let totalIllik = 0;
          let totalBorc = 0;
          
          allStudents.forEach((student) => {
            const illikValue = student.illik ? parseFloat(student.illik) : 0;
            totalIllik += illikValue;
            
            const { borc } = calculateDebtAndExtra(student.odemisMeblegi, student.illik);
            totalBorc += borc;
          });
          
          return (
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">📊 Tələbələr</h2>
                  <p className="text-blue-100">
                    <strong className="text-white">{pagination.total.toLocaleString('az-AZ')}</strong> tələbə mövcuddur
                  </p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-500">
                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
                  <div className="text-sm text-blue-200 mb-1">Toplam İllik</div>
                  <div className="text-2xl font-bold">{totalIllik.toFixed(2)} ₼</div>
                </div>
                <div className="bg-red-700 bg-opacity-50 rounded-lg p-3">
                  <div className="text-sm text-red-200 mb-1">Toplam Borc</div>
                  <div className="text-2xl font-bold">{totalBorc.toFixed(2)} ₼</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Filtreler */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">🔍 Filtrlər</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
            >
              ✕ Filtrləri Təmizlə
            </button>
          </div>

          {/* FIN Axtarış */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 FIN ilə Axtarış
            </label>
            <input
              type="text"
              value={filters.fin}
              onChange={(e) => handleFilterChange('fin', e.target.value)}
              placeholder="FIN kodunu daxil edin..."
              className="w-full text-blue-950 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filtre Select'leri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kurs</label>
              <select
                value={filters.kurs}
                onChange={(e) => handleFilterChange('kurs', e.target.value)}
                className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Hamısı</option>
                {filterOptions.kurs.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Qrup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qrup</label>
              <select
                value={filters.qrup}
                onChange={(e) => handleFilterChange('qrup', e.target.value)}
                className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Hamısı</option>
                {filterOptions.qrup.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Fakultə */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fakultə</label>
              <select
                value={filters.fakulte}
                onChange={(e) => handleFilterChange('fakulte', e.target.value)}
                className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Hamısı</option>
                {filterOptions.fakulte.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Qəbul İli */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qəbul İli</label>
              <select
                value={filters.qebulIli}
                onChange={(e) => handleFilterChange('qebulIli', e.target.value)}
                className="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Hamısı</option>
                {filterOptions.qebulIli.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toplam sayı */}
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-600">
              Toplam <strong>{pagination.total}</strong> tələbə tapıldı
              {(pagination.totalPages || 0) > 1 && (
                <span className="ml-2">
                  (Sayfa {pagination.page} / {pagination.totalPages})
                </span>
              )}
            </div>
            {students.length > 0 && (() => {
              const { totalIllik, totalBorc } = calculateTotals();
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-medium mb-1">Toplam İllik</div>
                    <div className="text-lg font-bold text-blue-700">{totalIllik.toFixed(2)} ₼</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-xs text-red-600 font-medium mb-1">Toplam Borc</div>
                    <div className="text-lg font-bold text-red-700">{totalBorc.toFixed(2)} ₼</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs text-green-600 font-medium mb-1">Gösterilen</div>
                    <div className="text-lg font-bold text-green-700">{students.length} tələbə</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Öğrenci Listesi */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4">Yüklənir...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            <p className="text-lg">Tələbə tapılmadı.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">📋 Tələbə Siyahısı</h2>
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
                        Ad Soyad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Kurs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Qrup
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Fakultə
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        İxtisas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Qəbul İli
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Ödəniş Məbləği
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        İllik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Borc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Əlavə Ödəniş
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => {
                      const isExpanded = expandedRows.has(student.id);
                      const payments = paymentsMap.get(student.id) || [];
                      const { borc, elaveOdemis } = calculateDebtAndExtra(student.odemisMeblegi, student.illik);
                      
                      return (
                        <>
                          <tr 
                            key={student.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                            onClick={() => toggleRowExpansion(student.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {(pagination.page - 1) * pagination.limit + index + 1}
                              {student.odemisMeblegi && student.odemisMeblegi > 0 && (
                                <span className="ml-2 text-xs text-gray-400">
                                  {isExpanded ? '▼' : '▶'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.fin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.adSoyad || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.kurs || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.qrup || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.fakulte || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.ixtisas || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.qebulIli || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {student.odemisMeblegi ? Number(student.odemisMeblegi).toFixed(2) : '0.00'} ₼
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                              {student.illik ? `${Number(student.illik).toFixed(2)} AZN` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                              {borc > 0 ? `${borc.toFixed(2)} ₼` : '0.00 ₼'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                              {elaveOdemis > 0 ? `${elaveOdemis.toFixed(2)} ₼` : '0.00 ₼'}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr key={`${student.id}-detail`} className="bg-blue-50">
                              <td colSpan={12} className="px-6 py-4">
                                {payments.length > 0 ? (
                                  <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h4 className="font-semibold text-gray-800 mb-3">Ödəniş Detayları</h4>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                              Tarix
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                              Məbləğ
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {payments.map((payment) => (
                                            <tr key={payment.id}>
                                              <td className="px-4 py-2 text-sm text-gray-900">
                                                {new Date(payment.paymentDate).toLocaleDateString('az-AZ')}
                                              </td>
                                              <td className="px-4 py-2 text-sm font-semibold text-green-600">
                                                {Number(payment.amount).toFixed(2)} ₼
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-lg p-4 shadow-sm text-center text-gray-500">
                                    Ödəniş detayları yüklənir...
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-gray-700">
                    {pagination.page === 1 ? '1' : (pagination.page - 1) * pagination.limit + 1} -{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} kayıt
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      ← Əvvəlki
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        const totalPages = pagination.totalPages;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                              pagination.page === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Sonrakı →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

