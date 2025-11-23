const FormSuccess = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-2 rounded-md mb-2">
      {message}
    </div>
  );
};

export default FormSuccess;
