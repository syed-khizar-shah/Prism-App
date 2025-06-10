import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoatingForm from './coatingForm'; // Adjust path if needed
import { Edit } from 'lucide-react';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const CoatingPage = () => {
  const [coatings, setCoatings] = useState([]);
  const [selectedCoating, setSelectedCoating] = useState(null);

  const fetchCoatings = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/coatings`);
      setCoatings(res.data);
    } catch (err) {
      console.error('Failed to fetch coatings', err);
    }
  };

  useEffect(() => {
    fetchCoatings();
  }, []);

  const handleEditClick = (coating) => {
    setSelectedCoating(coating);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll to form
  };

  const handleSaved = () => {
    setSelectedCoating(null);
    fetchCoatings();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <CoatingForm initialCoating={selectedCoating} onCoatingSaved={handleSaved} />

      <div className="grid grid-cols-2 gap-4">
        {coatings.map((coating) => (
          <div key={coating._id} className="p-3 border rounded space-y-2 relative">
            {coating.image && (
              <img
                src={coating.image}
                alt={coating.name}
                className="h-24 w-full object-contain"
              />
            )}
            <div className="font-medium">{coating.name}</div>
            <div className="text-sm text-gray-600">Price: {coating.price}</div>

            {/* Edit icon */}
            <button
              onClick={() => handleEditClick(coating)}
              className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800"
              aria-label={`Edit ${coating.name}`}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoatingPage;
