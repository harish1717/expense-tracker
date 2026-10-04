function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black transition"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;