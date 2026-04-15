export default function ErrorState({ onRetry }: any) {
  return (
    <div className="text-center mt-10">
      <p className="text-red-500 mb-2">Failed to load</p>
      <button
        onClick={onRetry}
        className="bg-black text-white px-4 py-2"
      >
        Retry
      </button>
    </div>
  );
}