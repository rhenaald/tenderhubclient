import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";

const HistoryList = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get("/user-history/");
                setHistory(res.data?.results || res.data || []);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = filter === "all"
        ? history
        : history.filter(item => item.type === filter);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">Riwayat Aktivitas</h3>
                <div>
                    <select
                        className="border rounded-lg px-3 py-2"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Semua Aktivitas</option>
                        <option value="project">Proyek</option>
                        <option value="payment">Pembayaran</option>
                        <option value="proposal">Proposal</option>
                        <option value="account">Akun</option>
                    </select>
                </div>
            </div>

            {filteredHistory.length > 0 ? (
                <div className="space-y-4">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="border rounded-lg p-5 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-lg">{item.title}</h4>
                                    <p className="text-gray-700 my-2">{item.description}</p>
                                    <div className="text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded-full text-xs ${item.type === 'project' ? 'bg-blue-100 text-blue-600' :
                                                item.type === 'payment' ? 'bg-green-100 text-green-600' :
                                                    item.type === 'proposal' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.type === 'project' ? 'Proyek' :
                                                item.type === 'payment' ? 'Pembayaran' :
                                                    item.type === 'proposal' ? 'Proposal' : 'Akun'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(item.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center py-12 text-center">
                    <h4 className="text-lg font-medium mb-2">Belum ada riwayat aktivitas</h4>
                    <p className="text-gray-500">Riwayat aktivitas Anda akan muncul di sini</p>
                </div>
            )}
        </div>
    );
};

export default HistoryList;