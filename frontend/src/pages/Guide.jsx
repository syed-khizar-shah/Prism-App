import { useState } from 'react';

const Guide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('workflow');

  const workflowSteps = [
    {
      id: 1,
      title: "Create Age Groups",
      description: "Define demographic categories (Children, Adults, Seniors, etc.)",
      icon: "👥",
      details: "Start by setting up age groups that will categorize your lens types. Each lens type can belong to multiple age groups."
    },
    {
      id: 2,
      title: "Define Colors & Coatings",
      description: "Set up available colors and coating options",
      icon: "🎨",
      details: "Configure the visual and functional properties that can be applied to lenses and designs."
    },
    {
      id: 3,
      title: "Set up Lens Types",
      description: "Create lens categories and assign to age groups",
      icon: "🔍",
      details: "Define different types of lenses. Remember: each lens type can be assigned to multiple age groups."
    },
    {
      id: 4,
      title: "Configure Power Ranges",
      description: "Define power specifications for each lens type",
      icon: "⚡",
      details: "Each lens will contain multiple power ranges to cover different vision correction needs."
    },
    {
      id: 5,
      title: "Add Recommended Lenses",
      description: "Create slimming options for each power range",
      icon: "💡",
      details: "Each power range should have one or more recommended lenses (slimming options) available."
    },
    {
      id: 6,
      title: "Create Extras",
      description: "Define additional features and services",
      icon: "➕",
      details: "Set up extra features that can be linked to designs, recommended lenses, and lens types."
    },
    {
      id: 7,
      title: "Build Designs",
      description: "Create designs with lens type and slimming option arrays",
      icon: "🎯",
      details: "Designs must contain both lens type arrays and slimming option arrays. They'll only appear when both criteria match."
    },
    {
      id: 8,
      title: "Link Everything",
      description: "Connect extras to designs and verify relationships",
      icon: "🔗",
      details: "Final step: ensure all relationships are properly established between extras, designs, and lens components."
    }
  ];

  const dataRelationships = [
    {
      entity: "Lens Types",
      icon: "🔍",
      relationships: ["Can belong to multiple Age Groups", "Contains multiple Power Ranges", "Referenced in Design arrays"],
      color: "bg-blue-100 border-blue-300"
    },
    {
      entity: "Power Ranges",
      icon: "⚡",
      relationships: ["Belongs to one Lens Type", "Contains 1+ Recommended Lenses"],
      color: "bg-green-100 border-green-300"
    },
    {
      entity: "Recommended Lenses",
      icon: "💡",
      relationships: ["Belongs to 1+ Power Ranges", "Can have unique codes for same names", "Referenced in Design arrays"],
      color: "bg-purple-100 border-purple-300"
    },
    {
      entity: "Designs",
      icon: "🎯",
      relationships: ["Contains Lens Type arrays", "Contains Slimming Option arrays", "Linked to Extras", "May have Coatings"],
      color: "bg-orange-100 border-orange-300"
    },
    {
      entity: "Extras",
      icon: "➕",
      relationships: ["Linked to Designs", "Connected to Recommended Lenses", "Connected to Lens Types"],
      color: "bg-pink-100 border-pink-300"
    }
  ];

  const displayRules = [
    {
      rule: "Design with Coating",
      result: "Shows: Design Name + Coating + Extras",
      icon: "✨",
      color: "text-green-600"
    },
    {
      rule: "Design without Coating",
      result: "Shows: Design Name + Extras only",
      icon: "📝",
      color: "text-blue-600"
    },
    {
      rule: "User selects Lens Type + Slimming Option",
      result: "Only designs with BOTH arrays matching will appear",
      icon: "🎯",
      color: "text-purple-600"
    },
    {
      rule: "Same Recommended Lens name, different prices",
      result: "Use unique 'Code' field to distinguish",
      icon: "💰",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard Guide</h1>
        <p className="text-gray-600 mb-8">Complete guide for managing the lens system</p>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'workflow', label: 'Setup Workflow', icon: '🔄' },
            { id: 'relationships', label: 'Data Relationships', icon: '🔗' },
            { id: 'rules', label: 'Display Rules', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Setup Steps</h2>
              <div className="space-y-2">
                {workflowSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      activeStep === index
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{step.icon}</span>
                      <div>
                        <div className="font-medium">Step {step.id}</div>
                        <div className="text-sm text-gray-600">{step.title}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Details */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{workflowSteps[activeStep].icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Step {workflowSteps[activeStep].id}: {workflowSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-600">{workflowSteps[activeStep].description}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Details:</h4>
                  <p className="text-gray-700 leading-relaxed">{workflowSteps[activeStep].details}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relationships Tab */}
        {activeTab === 'relationships' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Entity Relationships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataRelationships.map((entity, index) => (
                <div key={index} className={`rounded-lg border-2 p-6 ${entity.color}`}>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{entity.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{entity.entity}</h3>
                  </div>
                  <div className="space-y-2">
                    {entity.relationships.map((rel, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{rel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Display Rules</h2>
            <div className="grid grid-cols-1 gap-4">
              {displayRules.map((rule, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">{rule.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{rule.rule}</h3>
                      <p className={`font-medium ${rule.color}`}>{rule.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Important Notes</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• Designs only appear when BOTH lens type AND slimming option match user selection</li>
                <li>• Use the "Code" field for pricing variations of same-named recommended lenses</li>
                <li>• Lens types can belong to multiple age groups simultaneously</li>
                <li>• Always test the complete flow after making changes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;