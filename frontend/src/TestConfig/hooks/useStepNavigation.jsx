// hooks/useStepNavigation.js
import { useState } from "react";

export const useStepNavigation = (selections, data) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9; // Updated to 9 steps

  const getStepTitle = () => {
    const titles = {
      1: "Select Age Group",
      2: "Select Lens Type", 
      3: "Select Lens Subtype (Optional)",
      4: "Select Power Range",
      5: "Select Recommended Lens",
      6: "Select a Design",
      7: "Select Coatings (Optional)",
      8: "Select Extras (Optional)",
      9: "Configuration Complete!"
    };
    return titles[currentStep];
  };

  const getVisibleSteps = () => {
    const steps = [1, 2];

    if (!selections.lensType) return steps;

    if (data.lensSubtypes.length > 0) {
      steps.push(3);
    }

    if (selections.lensType || selections.lensSubtype) {
      steps.push(4); // Power Range step
    }

    if (selections.powerMap) {
      steps.push(5); // Recommended Lens step
    }

    if (data.designs.length > 0) {
      const visibleDesigns = data.designs.filter(d => d.isVisible !== false);
      if (!(data.designs.length === 1 && visibleDesigns.length === 0)) {
        steps.push(6); // Design step
      }
    }

    if (selections.design?.coating?.length > 0) {
      steps.push(7); // Coatings step
    }

    if (selections.design?.extras?.length > 0) {
      steps.push(8); // Extras step
    }

    steps.push(9); // Final step
    return steps;
  };

  const canProceed = () => {
    const requirements = {
      1: selections.ageGroup,
      2: selections.lensType,
      3: true, // Optional step
      4: selections.powerMap,
      5: selections.recommendedLens,
      6: selections.design || (data.designs.length > 0 && data.designs.filter(d => d.isVisible !== false).length === 0),
      7: true, // Optional step
      8: true, // Optional step
      9: true
    };
    return requirements[currentStep];
  };

  const goToStep = (step) => {
    const steps = getVisibleSteps();
    if (steps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    const steps = getVisibleSteps();
    const index = steps.indexOf(currentStep);
    if (index !== -1 && index + 1 < steps.length) {
      setCurrentStep(steps[index + 1]);
    }
  };

  const handlePrev = () => {
    const steps = getVisibleSteps();
    const index = steps.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(steps[index - 1]);
    }
  };

  return {
    currentStep,
    totalSteps,
    setCurrentStep,
    getStepTitle,
    getVisibleSteps,
    canProceed,
    goToStep,
    handleNext,
    handlePrev
  };
};