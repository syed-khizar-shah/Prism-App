import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react';
import axiosInstance from '../../../api/axios';

const SECTION_META = {
  items: {
    label: 'Items',
    rows: {
      frame:       'Frame',
      ageGroup:    'Age Group',
      lensType:    'Lens Type',
      lensSubtype: 'Lens Subtype',
      lensIndex:   'Lens Index',
      design:      'Design',
      coatings:    'Coatings',
      extras:      'Extras',
      color:       'Color',
      subtotal:    'Subtotal',
    },
  },
};

const SECTION_KEYS = Object.keys(SECTION_META);

const ReportConfig = () => {
  const [sections, setSections]   = useState(null);
  const [expanded, setExpanded]   = useState({ items: true });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/report-config');
      console.log({res});
      console.log({d:res.data.data.sections});
      setSections(res.data.data.sections);
    } catch (err) {
      console.log({err})
      setError(err.response?.data?.message || 'Failed to load report config');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionKey) => {
    setSections(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [sectionKey]: { ...prev[sectionKey], enabled: !prev[sectionKey].enabled },
      };
    });
  };

  const toggleRow = (sectionKey, rowKey) => {
    setSections(prev => {
      if (!prev) return prev;
      const section = prev[sectionKey];
      return {
        ...prev,
        [sectionKey]: {
          ...section,
          rows: {
            ...section.rows,
            [rowKey]: { ...section.rows[rowKey], enabled: !section.rows[rowKey].enabled },
          },
        },
      };
    });
  };

  const handleLabelChange = (sectionKey, rowKey, value) => {
    setSections(prev => {
      if (!prev) return prev;
      const section = prev[sectionKey];
      return {
        ...prev,
        [sectionKey]: {
          ...section,
          rows: {
            ...section.rows,
            [rowKey]: { ...section.rows[rowKey], label: value },
          },
        },
      };
    });
  };

  const handleSave = async () => {
    if (!sections) return;
    setSaving(true);
    setError(null);
    try {
      for (const sectionKey of SECTION_KEYS) {
        const section = sections[sectionKey];
        if (!section) continue;

        // 1. Save section-level enabled flag
        await axiosInstance.patch(`/api/report-config/sections/${sectionKey}`, {
          enabled: section.enabled,
        });

        // 2. Save each row — send only { enabled, label } per row, strip any extra fields
        const rowsPayload = {};
        for (const rowKey of Object.keys(SECTION_META[sectionKey].rows)) {
          const row = section.rows?.[rowKey];
          if (!row) continue;
          rowsPayload[rowKey] = { enabled: row.enabled, label: row.label };
        }

        await axiosInstance.patch(`/api/report-config/sections/${sectionKey}/rows`, rowsPayload);
      }

      // Re-fetch to confirm what was actually persisted
      await fetchConfig();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving config');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/api/report-config/reset');
      setSections(res.data.data.sections);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting config');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-medium text-gray-900">Report Configuration</h2>
        <p className="text-sm text-gray-500 mt-1">
          Toggle sections and individual rows that appear in generated reports.
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {SECTION_KEYS.map((sectionKey) => {
          const meta    = SECTION_META[sectionKey];
          const section = sections?.[sectionKey];
          if (!section) return null;

          const rowKeys      = Object.keys(meta.rows);
          const visibleCount = rowKeys.filter(r => section.rows?.[r]?.enabled).length;
          const isExpanded   = expanded[sectionKey] ?? true;

          return (
            <div
              key={sectionKey}
              className={`border rounded-lg overflow-hidden transition-colors ${
                section.enabled ? 'border-gray-200' : 'border-gray-100'
              }`}
            >
              <div className={`flex items-center gap-3 px-4 py-3 bg-gray-50 ${!section.enabled ? 'opacity-60' : ''}`}>
                {/* <button type="button" onClick={() => toggleSection(sectionKey)} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                  {section.enabled ? <ToggleRight className="w-6 h-6 text-gray-900" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                </button> */}

                <span className="text-sm font-semibold text-gray-900 flex-1">{meta.label}</span>

                <span className="text-xs text-gray-400">{visibleCount} / {rowKeys.length} rows visible</span>

                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  section.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {section.enabled ? 'Visible' : 'Hidden'}
                </span>

                <button
                  type="button"
                  onClick={() => setExpanded(prev => ({ ...prev, [sectionKey]: !isExpanded }))}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors ml-1"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className={`divide-y divide-gray-100 ${!section.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                  {rowKeys.map((rowKey) => {
                    const row       = section.rows?.[rowKey];
                    const isEnabled = row?.enabled ?? true;

                    return (
                      <div key={rowKey} className={`flex items-center gap-4 px-4 py-2.5 bg-white ${!isEnabled ? 'opacity-50' : ''}`}>
                        <button type="button" onClick={() => toggleRow(sectionKey, rowKey)} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                          {isEnabled ? <ToggleRight className="w-5 h-5 text-gray-700" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                        </button>

                        <span className="text-sm text-gray-500 w-32 flex-shrink-0">{meta.rows[rowKey]}</span>

                        <input
                          type="text"
                          value={row?.label ?? meta.rows[rowKey]}
                          onChange={(e) => handleLabelChange(sectionKey, rowKey, e.target.value)}
                          disabled={!isEnabled}
                          placeholder={meta.rows[rowKey]}
                          className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
                        />

                        <span className={`ml-auto flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${
                          isEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          {isEnabled ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-100 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Check className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
        >
          {resetting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" /> : <RotateCcw className="w-4 h-4" />}
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default ReportConfig;