// components/FrameSummaryManager.js
import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, ArrowUp, ArrowDown, X, ArrowLeft, Copy, Check } from 'lucide-react';
import FrameSummaryAPI from './FrameSummaryAPI';

const FrameSummaryManager = () => {
  const [summary, setSummary] = useState(null);
  const [fields, setFields] = useState([]);
  const [originalFields, setOriginalFields] = useState([]); // Track original state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Function to generate a unique field key
  const generateFieldKey = (name = '', existingKeys = []) => {
    // Base key from field name or fallback
    let baseKey = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // Fallback if name is empty or results in empty key
    if (!baseKey) {
      baseKey = 'field';
    }

    // Ensure uniqueness
    let uniqueKey = baseKey;
    let counter = 1;

    while (existingKeys.includes(uniqueKey)) {
      uniqueKey = `${baseKey}_${counter}`;
      counter++;
    }

    return uniqueKey;
  };

  // Function to copy key to clipboard
  const copyKeyToClipboard = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    // Always check for changes, regardless of originalFields length
    const hasChanges = JSON.stringify(fields) !== JSON.stringify(originalFields);
    setHasUnsavedChanges(hasChanges);
  }, [fields, originalFields]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    const handlePopState = (e) => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmed) {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await FrameSummaryAPI.getFrameSummary();
      console.log({ data })

      setSummary(data);
      setFields([...data.fields]);
      setOriginalFields([...data.fields]); // Store original state
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    const existingKeys = fields.map(f => f.key);
    const newField = {
      key: generateFieldKey('', existingKeys), // Generate unique key
      name: '',
      type: 'text',
      required: false,
      isActive: true,
      order: fields.length + 1,
      options: []
    };
    setFields([...fields, newField]);

    // Scroll to the new field after it's added
    setTimeout(() => {
      const newFieldIndex = fields.length;
      const fieldElement = document.querySelector(`[data-field-index="${newFieldIndex}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        // Focus on the field name input for immediate editing
        const nameInput = fieldElement.querySelector('input[name="field-name"]');
        if (nameInput) {
          nameInput.focus();
        }
      }
    }, 100);
  };

  const handleUpdateField = (index, updates) => {
    const updatedFields = [...fields];
    const currentField = updatedFields[index];

    updatedFields[index] = { ...currentField, ...updates };
    setFields(updatedFields);
  };

  const handleFieldNameBlur = (index, name) => {
    const updatedFields = [...fields];
    const currentField = updatedFields[index];

    // Only generate key if field doesn't have a proper key yet (is generic or empty) and name is not empty
    const isGenericKey = !currentField.key || currentField.key.startsWith('field');
    if (isGenericKey && name.trim()) {
      const existingKeys = updatedFields.map((f, i) => i !== index ? f.key : null).filter(Boolean);
      updatedFields[index] = {
        ...currentField,
        key: generateFieldKey(name.trim(), existingKeys)
      };
      setFields(updatedFields);
    }
  };

  const handleRemoveField = (index) => {
    if (window.confirm('Are you sure you want to remove this field?')) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleMoveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newFields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];

      // Update order values
      newFields[index].order = index + 1;
      newFields[targetIndex].order = targetIndex + 1;

      setFields(newFields);
    }
  };

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options = [...updatedFields[fieldIndex].options, ''];
    setFields(updatedFields);
  };

  const handleUpdateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setFields(updatedFields);
  };

  const handleSave = async () => {
    setError(null);

    // Validate fields
    const invalidFields = fields.filter(field => !field.name.trim());
    if (invalidFields.length > 0) {
      setError('All fields must have a name');
      return;
    }

    try {
      setSaving(true);
      const data = { fields };
      const result = await FrameSummaryAPI.updateFrameSummary(summary._id, data);
      setSummary(result);
      setFields([...result.fields]);
      setOriginalFields([...result.fields]); // Update original state after successful save
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes? This action cannot be undone.')) {
      setFields([...originalFields]);
      setHasUnsavedChanges(false);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmed) {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-700">Error</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchSummary}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${hasUnsavedChanges ? 'pb-24' : ''}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-gray-900" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Frame Summary Configuration</h1>
                <p className="text-sm text-gray-500 mt-2">
                  Configure the fields for your frame summary
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              <button
                onClick={handleAddField}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${hasUnsavedChanges
                  ? 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  } ${saving ? 'opacity-50' : ''}`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </div>

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">!</span>
                  </div>
                  <div>
                    <p className="text-yellow-800 font-medium">You have unsaved changes</p>
                    <p className="text-yellow-700 text-sm">Save your changes or discard them before leaving this page.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDiscardChanges}
                    className="px-3 py-1.5 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md text-sm font-medium transition-colors"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {summary && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium text-gray-900">Fields Configuration</h2>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(summary.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Configure the fields that will be used in your frame summaries. You can add, remove, and reorder fields as needed.
              </p>
            </div>

            <div className="p-6">
              {fields.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Configured</h3>
                  <p className="text-gray-500 mb-4">Add your first field to get started.</p>
                  <button
                    onClick={handleAddField}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add First Field
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Fields Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Configured Fields</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {fields.length} field{fields.length !== 1 ? 's' : ''} configured • Drag to reorder
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {fields.length}
                    </div>
                  </div>

                  {/* Fields List */}
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" data-field-index={index}>
                        {/* Field Header */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {field.name || 'Unnamed Field'}
                                </h4>
                                <p className="text-xs text-gray-500 capitalize">
                                  {field.type} field • {field.required ? 'Required' : 'Optional'} • {field.isActive ? 'Active' : 'Inactive'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveField(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveField(index, 'down')}
                                disabled={index === fields.length - 1}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              {
                                field.key === "frame_price" ||
                                <button
                                  type="button"
                                  onClick={() => handleRemoveField(index)}
                                  className={`p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors`}
                                  title="Remove field"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              }
                            </div>
                          </div>
                        </div>

                        {/* Field Configuration */}
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Field Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="field-name"
                                value={field.name}
                                onChange={(e) => handleUpdateField(index, { name: e.target.value })}
                                onBlur={(e) => handleFieldNameBlur(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                placeholder="Enter field name"
                              />
                            </div>

                            {/* Field Key */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field Key
                                <span className="text-xs text-gray-500 ml-1">(Auto-generated, read-only)</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={field.key || ''}
                                  readOnly
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 bg-gray-50 rounded-md text-sm text-gray-600 cursor-not-allowed"
                                  placeholder="Key will be generated from field name"
                                />
                                {field.key && (
                                  <button
                                    type="button"
                                    onClick={() => copyKeyToClipboard(field.key)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Copy key to clipboard"
                                  >
                                    {copiedKey === field.key ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Field Type */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => handleUpdateField(index, { type: e.target.value, options: e.target.value === 'select' ? field.options : [] })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                              >
                                <option value="text">Text Input</option>
                                <option value="number">Number Input</option>
                                <option value="select">Dropdown Select</option>
                              </select>
                            </div>

                            {/* Field Options */}
                            <div>
                              <div className="flex items-center space-x-6">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Required field</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.isActive}
                                    onChange={(e) => handleUpdateField(index, { isActive: e.target.checked })}
                                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Select Options (if field type is select) */}
                          {field.type === 'select' && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                              <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Select Options
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddOption(index)}
                                  className="inline-flex items-center gap-1 text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Option
                                </button>
                              </div>
                              <div className="space-y-2">
                                {field.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleUpdateOption(index, optionIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                      placeholder="Enter option value"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOption(index, optionIndex)}
                                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                      title="Remove option"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                {field.options.length === 0 && (
                                  <div className="text-center py-4 bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">No options added yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Add options to create a dropdown menu</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar for Unsaved Changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">!</span>
                </div>
                <div>
                  <p className="text-yellow-800 font-medium">Unsaved changes detected</p>
                  <p className="text-yellow-700 text-sm">Save your work or discard changes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDiscardChanges}
                  className="px-4 py-2 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md text-sm font-medium transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameSummaryManager;