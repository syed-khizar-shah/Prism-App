import { ColorSelector, SelectionCard } from "./steps/FlowComponents";

const SummaryStep = ({ totalPrice }) => (
  <div>
    <h2 className="font-semibold text-xl mb-6 text-green-600">Configuration Complete!</h2>
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-2xl font-bold text-green-700 mb-2">
          Total Price: £{totalPrice.toFixed(2)}
        </div>
        <p className="text-green-600">Ready to proceed with your order</p>
      </div>
    </div>
  </div>
);

export default SummaryStep