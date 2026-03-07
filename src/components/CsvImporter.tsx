'use client';

import React, { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CsvImporterProps {
    onComplete?: () => void;
}

export default function CsvImporter({ onComplete }: CsvImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const supabase = useMemo(() => createClient(), []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            parsePreview(selectedFile);
            setError(null);
        } else {
            setError('Please select a valid CSV file.');
        }
    };

    // Proper CSV parser — handles quoted fields with commas inside them (RFC 4180)
    const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { current += '"'; i++; } // escaped quote
                else inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += ch;
            }
        }
        result.push(current.trim());
        return result;
    };

    const parsePreview = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = parseCsvLine(lines[0]).map(h => h.trim());

            const rows = lines.slice(1, 4).map(line => {
                const values = parseCsvLine(line);
                const obj: any = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i];
                });
                return obj;
            });
            setPreview(rows);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase());

            const idx = {
                name: headers.indexOf('name'),
                category: headers.indexOf('category'),
                phone: headers.indexOf('phone'),
                address: headers.indexOf('address'),
                website: headers.indexOf('website'),
            };

            if (idx.name === -1) {
                throw new Error('CSV must contain a "Name" column.');
            }

            const isValidUrl = (val: string) =>
                val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('www.'));

            const rows = lines.slice(1).map(line => {
                const values = parseCsvLine(line);
                const address = idx.address >= 0 ? (values[idx.address] || '') : '';
                const rawWebsite = idx.website >= 0 ? (values[idx.website] || '') : '';

                const towns = ['Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];
                const town = towns.find(t => address.toLowerCase().includes(t.toLowerCase())) || 'Marinduque';

                return {
                    business_name: values[idx.name],
                    business_type: idx.category >= 0 ? (values[idx.category] || 'General') : 'General',
                    location: town,
                    contact_info: {
                        phone: idx.phone >= 0 ? (values[idx.phone] || '') : '',
                        address: address,
                    },
                    // Only store as website if it actually looks like a URL
                    website: isValidUrl(rawWebsite) ? rawWebsite : null,
                    gallery_image: null,
                    categories: idx.category >= 0 && values[idx.category] ? [values[idx.category]] : [],
                    stats: { total_sales: 0, customer_count: 0, products_listed: 0 },
                };
            }).filter(r => r.business_name && r.business_name.trim() !== '');

            const { error: insertError } = await supabase.rpc('bulk_import_businesses', { rows });
            if (insertError) throw insertError;

            alert(`Successfully imported ${rows.length} businesses!`);
            if (onComplete) onComplete();

        } catch (err: any) {
            const detail = err?.details || err?.message || err?.error_description
                || (err?.code ? `Code: ${err.code}` : '')
                || JSON.stringify(err, Object.getOwnPropertyNames(err))
                || 'Unknown error';
            console.error('Import error detail:', detail);
            setError(detail || 'Failed to import data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-50/50 dark:bg-zinc-900/50 text-center">
                <span className="material-symbols-outlined text-4xl text-teal-600 mb-4">upload_file</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload CSV File</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Required Headers: Name, Category, Phone, Address, Website
                </p>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                />
                <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Choose File
                </label>

                {file && (
                    <div className="mt-4 text-sm font-medium text-teal-600 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {file.name}
                    </div>
                )}
            </div>

            {preview.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Mapping Preview (First 3 rows)</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-zinc-800">
                                    <th className="px-4 py-2 font-bold text-slate-500">Name</th>
                                    <th className="px-4 py-2 font-bold text-slate-500">Category</th>
                                    <th className="px-4 py-2 font-bold text-slate-500">Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {preview.map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3 text-slate-900 dark:text-white">{row.Name || row.name}</td>
                                        <td className="px-4 py-3 text-slate-500">{row.Category || row.category}</td>
                                        <td className="px-4 py-3 text-slate-500 italic truncate max-w-[150px]">{row.Address || row.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex gap-2 items-center">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                </div>
            )}

            <button
                onClick={handleImport}
                disabled={!file || loading}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${!file || loading
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-700 hover:bg-teal-600 text-white active:scale-[0.98]'
                    }`}
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined">database</span>
                        Finalize Import to Database
                    </>
                )}
            </button>
        </div>
    );
}
