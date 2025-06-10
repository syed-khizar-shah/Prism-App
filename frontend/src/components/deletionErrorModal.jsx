// Reusable Deletion Error Modal Component
export const DeletionErrorModal = ({
    isOpen,
    onClose,
    errorData,
    onReferenceClick
}) => {
    if (!isOpen || !errorData) return null;

    const { message, references = [], objectType = 'item' } = errorData;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Cannot Delete {objectType}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700 mb-3">
                        {message}
                        <br />
                        Please remove each reference before trying to delete this {objectType} again.
                    </p>

                    {references.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-800 mb-2">
                                Referenced in the following items:
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {references.map((reference, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 bg-gray-50 rounded border ${onReferenceClick ? 'cursor-pointer hover:bg-gray-100' : ''
                                            }`}
                                        onClick={() => onReferenceClick?.(reference)}
                                    >
                                        <div className="text-sm">
                                            <div className="text-gray-600">
                                                ID: {reference}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}