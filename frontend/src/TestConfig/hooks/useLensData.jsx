// hooks/useLensData.js
import { useEffect, useState } from "react";
import { LensDataService } from "../services/lensDataService";

export const useLensData = (selections, updateSelection, resetSelectionsFrom) => {
  const [data, setData] = useState({
    ageGroups: [],
    lensTypes: [],
    lensSubtypes: [],
    powerMappings: [],
    designs: []
  });

  useEffect(() => {
    if (selections.lensSubtype) {
      const powerMappings = selections.lensSubtype.powerLensMap || [];
      setData(prev => ({ ...prev, powerMappings }));
    }
  }, [selections.lensSubtype]);

  // Fetch age groups on mount
  useEffect(() => {
    const loadAgeGroups = async () => {
      const ageGroups = await LensDataService.fetchAgeGroups();
      setData(prev => ({ ...prev, ageGroups }));
    };
    loadAgeGroups();
  }, []);

  // Fetch main lens types when age group selected
  useEffect(() => {
    if (selections.ageGroup) {
      const loadLensTypes = async () => {
        const mainLensTypes = await LensDataService.fetchMainLensTypes(selections.ageGroup._id);
        setData(prev => ({ ...prev, lensTypes: mainLensTypes }));
      };
      loadLensTypes();
    }
  }, [selections.ageGroup]);

  // Fetch lens subtypes when main lens type selected
  useEffect(() => {
    if (selections.lensType && selections.ageGroup) {
      const loadLensSubtypes = async () => {
        const subtypes = await LensDataService.fetchLensSubtypes(
          selections.ageGroup._id,
          selections.lensType._id
        );
        setData(prev => ({ ...prev, lensSubtypes: subtypes }));

        // Auto-proceed if no subtypes available
        if (subtypes.length === 0) {
          handleSkipSubtype();
        }
      };
      loadLensSubtypes();
    }
  }, [selections.lensType, selections.ageGroup]);

  const handleSkipSubtype = () => {
    const powerMappings = selections.lensType.powerLensMap || [];
    setData(prev => ({ ...prev, powerMappings }));
  };

  const fetchDesigns = async (recommendedLens) => {
    const selectedLens = selections.lensSubtype || selections.lensType;
    if (!selectedLens || !recommendedLens) return;

    const designs = await LensDataService.fetchDesignsByLensPair(
      selectedLens._id,
      recommendedLens._id
    );

    setData(prev => ({ ...prev, designs }));

    const visibleDesigns = designs.filter(design => design.isVisible !== false);

    if (designs.length === 1 && visibleDesigns.length === 0) {
      const singleDesign = designs[0];
      updateSelection("design", singleDesign);
    }
  };

  return {
    data,
    handleSkipSubtype,
    fetchDesigns
  };
};