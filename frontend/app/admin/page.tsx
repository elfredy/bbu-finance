'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

interface Group {
  qrup: string;
  studentCount: number;
  activeCount: number;
  isActive: boolean;
}

interface Student {
  id: number;
  fin: string;
  adSoyad: string | null;
  active: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [mebleg, setMebleg] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState<string | null>(null);
  const [studentsInGroup, setStudentsInGroup] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await axios.get<Group[]>(`${API_BASE_URL}/api/students/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Qruplar yüklenemedi:', error);
      setMessage({ type: 'error', text: 'Qruplar yüklenemedi' });
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGroup) {
      setMessage({ type: 'error', text: 'Lütfen bir qrup seçin!' });
      return;
    }

    const meblegValue = parseFloat(mebleg);
    if (isNaN(meblegValue) || meblegValue < 0) {
      setMessage({ type: 'error', text: 'Lütfen geçerli bir məbləğ girin!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/students/groups/update-illik`, {
        qrup: selectedGroup,
        mebleg: meblegValue,
      });

      setMessage({
        type: 'success',
        text: `Başarılı! ${response.data.updated} öğrencinin illik məbləği ${meblegValue.toFixed(2)} AZN olarak güncellendi.`,
      });

      // Formu temizle
      setSelectedGroup('');
      setMebleg('');

      // Qrupları yeniden yükle
      await loadGroups();

      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Güncelleme sırasında hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (qrup: string, currentActive: boolean) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/students/groups/toggle-active`, {
        qrup,
        active: !currentActive,
      });

      setMessage({
        type: 'success',
        text: `Başarılı! ${response.data.updated} öğrenci ${!currentActive ? 'aktif' : 'deaktiv'} edildi.`,
      });

      // Qrupları yeniden yükle
      await loadGroups();
      
      // Eğer seçili qrupun öğrencileri gösteriliyorsa, onları da yeniden yükle
      if (selectedGroupForStudents === qrup) {
        await loadStudentsInGroup(qrup);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Güncelleme sırasında hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsInGroup = async (qrup: string) => {
    setLoadingStudents(true);
    try {
      const response = await axios.get<Student[]>(`${API_BASE_URL}/api/students/groups/${encodeURIComponent(qrup)}/students`);
      setStudentsInGroup(response.data);
      setSelectedGroupForStudents(qrup);
    } catch (error) {
      console.error('Öğrenciler yüklenemedi:', error);
      setMessage({ type: 'error', text: 'Öğrenciler yüklenemedi' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleStudentActive = async (studentId: number, currentActive: boolean) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/students/toggle-active`, {
        studentId,
        active: !currentActive,
      });

      setMessage({
        type: 'success',
        text: `Başarılı! Öğrenci ${!currentActive ? 'aktif' : 'deaktiv'} edildi.`,
      });

      // Öğrenci listesini yeniden yükle
      if (selectedGroupForStudents) {
        await loadStudentsInGroup(selectedGroupForStudents);
      }
      
      // Qrupları da yeniden yükle (aktif sayıları güncellensin)
      await loadGroups();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Güncelleme sırasında hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingExcel(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/api/upload-students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({
        type: 'success',
        text: `Başarılı! ${response.data.count} öğrenci yüklendi.`,
      });

      // Qrupları yeniden yükle
      await loadGroups();

      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Excel yükleme sırasında hata oluştu',
      });
    } finally {
      setUploadingExcel(false);
      // Input'u temizle
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
            ← Ana səhifəyə keçid et
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Paneli</h1>
          <p className="text-lg text-gray-600">Qruplara İllik Məbləğ Təyin Et və Tələbə Excel Dosyası Yüklə</p>
        </div>

        {/* Excel Yükleme Bölümü */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Tələbə Excel Dosyası Yüklə</h2>
          <p className="text-sm text-gray-600 mb-4">
            Tələbə bilgilerini içeren Excel dosyasını yükleyin. Dosyada FIN, Ad Soyad, Kurs, Qrup, Fakultə, İxtisas, Qəbul İli kolonları olmalıdır.
          </p>
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                disabled={uploadingExcel}
                className="hidden"
                id="excel-upload"
              />
              <div
                className={`w-full px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors ${
                  uploadingExcel
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    : 'border-indigo-300 bg-indigo-50 hover:border-indigo-500 hover:bg-indigo-100'
                }`}
              >
                <span className="text-indigo-600 font-medium">
                  {uploadingExcel ? 'Yükleniyor...' : '📤 Excel Dosyası Seç və Yüklə'}
                </span>
              </div>
            </label>
          </div>
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

        {/* Qrup ve Məbləğ Formu */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">💳 İllik Məbləğ Təyin Et</h2>

          <div className="space-y-6">
            {/* Qrup Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qrup Seçin <span className="text-red-500">*</span>
              </label>
              {loadingGroups ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                  Yüklənir...
                </div>
              ) : (
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Qrup seçin...</option>
                  {groups.map((group) => (
                    <option key={group.qrup} value={group.qrup}>
                      {group.qrup} ({group.studentCount} öğrenci)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Məbləğ Girişi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İllik Məbləğ (AZN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={mebleg}
                onChange={(e) => setMebleg(e.target.value)}
                placeholder="Məsələn: 2500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Save Butonu */}
            <div>
              <button
                onClick={handleSave}
                disabled={loading || !selectedGroup || !mebleg}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Yüklənir...' : '💾 Save Et'}
              </button>
            </div>
          </div>
        </div>

        {/* Qruplar Listesi - Active/Deactive */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📋 Qrupları Aktiv/Deaktiv Et ({groups.length})
          </h2>
          
          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="🔍 Qrup axtarışı..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            />
          </div>

          {loadingGroups ? (
            <div className="text-center py-8 text-gray-500">Yüklənir...</div>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                {groups
                  .filter((group) => 
                    group.qrup.toLowerCase().includes(groupSearch.toLowerCase())
                  )
                  .map((group) => (
                  <div
                    key={group.qrup}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      selectedGroup === group.qrup
                        ? 'border-indigo-500 bg-indigo-50'
                        : group.isActive
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50 opacity-60'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{group.qrup}</div>
                      <div className="text-sm text-gray-600">
                        {group.activeCount} / {group.studentCount} aktiv öğrenci
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Öğrencileri Göster Butonu */}
                      <button
                        onClick={() => loadStudentsInGroup(group.qrup)}
                        disabled={loadingStudents}
                        className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedGroupForStudents === group.qrup ? '👁️ Gösterilir' : '👁️ Öğrencilər'}
                      </button>
                      
                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleActive(group.qrup, group.isActive)}
                        disabled={loading}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          group.isActive
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                            group.isActive ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
                {groups.filter((group) => 
                  group.qrup.toLowerCase().includes(groupSearch.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Qrup tapılmadı
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Seçili Qrupun Öğrencileri */}
        {selectedGroupForStudents && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                📚 {selectedGroupForStudents} Qrupunun tələbələri ({studentsInGroup.length})
              </h2>
              <button
                onClick={() => {
                  setSelectedGroupForStudents(null);
                  setStudentsInGroup([]);
                }}
                className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
              >
                ✕ Bağla
              </button>
            </div>

            {loadingStudents ? (
              <div className="text-center py-8 text-gray-500">Yüklənir...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {studentsInGroup.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        student.active
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50 opacity-60'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {student.fin} - {student.adSoyad || 'Ad Soyad yoxdur'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.active ? '✅ Aktiv' : '❌ Deaktiv'}
                        </div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleStudentActive(student.id, student.active)}
                        disabled={loading}
                        className={`ml-4 relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          student.active
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                            student.active ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  {studentsInGroup.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Bu qrupda tələbə yoxdur
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
