// lensDataService.js
import ApiService from './apiService';

export const LensDataService = {
  // Fetch age groups
  async fetchAgeGroups() {
    return await ApiService.fetchData('/api/age-groups');
  },

  // Fetch lenses by age group
  async fetchLensesByAgeGroup(ageGroupId) {
    return await ApiService.fetchData(`/api/lenses?ageGroupId=${ageGroupId}`);
  },

  // Fetch main lens types (no subtypes)
  async fetchMainLensTypes(ageGroupId) {
    const allLenses = await this.fetchLensesByAgeGroup(ageGroupId);
    return allLenses.filter(lens => lens.subtypeOf === null || lens.subtypeOf === undefined);
  },

  // Fetch lens subtypes for a specific lens type
  async fetchLensSubtypes(ageGroupId, lensTypeId) {
    const allLenses = await this.fetchLensesByAgeGroup(ageGroupId);
    return allLenses.filter(lens => lens.subtypeOf?._id === lensTypeId);
  },

  // Fetch designs by lens pair
  async fetchDesignsByLensPair(lensTypeId, recommendedLensId) {
    return await ApiService.postData('/api/designs/find-by-lens-pair', {
      lensTypeId,
      recommendedLensId
    });
  }
};