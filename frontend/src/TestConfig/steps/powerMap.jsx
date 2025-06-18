import React from 'react';
import { SelectionCard } from './FlowComponents';

const PowerMappingStep = ({ 
  powerMappings, 
  selectedPowerMap, 
  onSelect 
}) => {
  if (!powerMappings || powerMappings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Power Ranges Available</h3>
        <p className="text-gray-600">
          Please contact support for assistance with power range selection.
        </p>
      </div>
    );
  }

  // Custom card component for power ranges
  const PowerRangeCard = ({ powerMap, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {powerMap.min} to {powerMap.max}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          Power Range
        </div>
        
        {/* Show number of recommended lenses */}
        <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block">
          {powerMap.recommendedLenses?.length || 0} recommended lens{powerMap.recommendedLenses?.length !== 1 ? 'es' : ''}
        </div>
        
        {/* Preview of recommended lenses */}
        {powerMap.recommendedLenses && powerMap.recommendedLenses.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Recommended:</div>
            <div className="text-xs text-gray-700">
              {powerMap.recommendedLenses.slice(0, 2).map(lens => lens.name).join(', ')}
              {powerMap.recommendedLenses.length > 2 && ` +${powerMap.recommendedLenses.length - 2} more`}
            </div>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select Power Range
        </h2>
        <p className="text-gray-600">
          Choose the power range that matches your prescription requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {powerMappings.map((powerMap) => (
          <PowerRangeCard
            key={`${powerMap.min}-${powerMap.max}`}
            powerMap={powerMap}
            isSelected={selectedPowerMap?.min === powerMap.min && selectedPowerMap?.max === powerMap.max}
            onClick={() => onSelect(powerMap)}
          />
        ))}
      </div>

      {powerMappings.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-900">
                Power Range Selection
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Select the power range that covers your prescription. The next step will show you the recommended lenses for your chosen range.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerMappingStep;