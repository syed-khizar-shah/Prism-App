import { useState, useCallback } from "react";

// Custom hook for managing selections state
export const useSelections = () => {
  const [selections, setSelections] = useState({
    ageGroup: null,
    lensType: null,
    lensSubtype: null,
    powerMap: null,
    recommendedLens: null,
    design: null,
    coatings: [],
    extras: []
  });

  const [selectedColors, setSelectedColors] = useState({});

  const updateSelection = useCallback((key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSelectionsFrom = useCallback((step) => {
    const resetMap = {
      1: ['lensType', 'lensSubtype', 'powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      2: ['lensSubtype', 'powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      3: ['powerMap', 'recommendedLens', 'design', 'coatings', 'extras'],
      4: ['recommendedLens', 'design', 'coatings', 'extras'], // Power map step
      5: ['design', 'coatings', 'extras'], // Recommended lens step
      6: ['coatings', 'extras'], // Design step
      7: ['extras'] // Coatings step
    };

    const fieldsToReset = resetMap[step] || [];
    setSelections(prev => {
      const newSelections = { ...prev };
      fieldsToReset.forEach(field => {
        newSelections[field] = Array.isArray(prev[field]) ? [] : null;
      });
      return newSelections;
    });
    setSelectedColors({});
  }, []);

  const toggleCoating = useCallback((coating) => {
    setSelections(prev => ({
      ...prev,
      coatings: prev.coatings.find(c => c._id === coating._id)
        ? prev.coatings.filter(c => c._id !== coating._id)
        : [...prev.coatings, coating]
    }));
  }, []);

  const toggleExtra = useCallback((extra) => {
    setSelections(prev => {
      const exists = prev.extras.find(e => e._id === extra._id);
      if (exists) {
        setSelectedColors(prevColors => {
          const newColors = { ...prevColors };
          delete newColors[extra._id];
          return newColors;
        });
        return {
          ...prev,
          extras: prev.extras.filter(e => e._id !== extra._id)
        };
      } else {
        return {
          ...prev,
          extras: [...prev.extras, extra]
        };
      }
    });
  }, []);

  const handleColorSelect = useCallback((extraId, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [extraId]: color
    }));
  }, []);

  const calculateTotalPrice = useCallback(() => {
    let price = 0;
    if (selections.ageGroup) price += selections.ageGroup.price || 0;
    if (selections.lensType) price += selections.lensType.price || 0;
    if (selections.lensSubtype) price += selections.lensSubtype.price || 0;
    if (selections.recommendedLens) price += selections.recommendedLens.price || 0;
    if (selections.design) price += selections.design.price || 0;
    selections.coatings.forEach(coating => price += coating.price || 0);
    selections.extras.forEach(extra => price += extra.price || 0);
    console.log({price})
    console.log(selections)
    return price;
  }, [selections]);

  return {
    selections,
    selectedColors,
    updateSelection,
    resetSelectionsFrom,
    toggleCoating,
    toggleExtra,
    handleColorSelect,
    calculateTotalPrice
  };
};