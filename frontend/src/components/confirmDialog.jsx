import { AnimatePresence, motion } from "framer-motion";

export default function confirmDialog({
    open,
    title,
    description,
    confirmLabel = "Hapus",
    loading = false,
    onConfirm,
    onCancel,
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-6"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        role="alertdialog"
                        aria-modal="true"
                        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6"
                    >
                        <h2 className="font-display text-lg font-semibold text-text">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-text-muted">{description}</p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-full border border-border px-4 py-2 font-mono text-xs text-text-muted transition-colors hover:text-text"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={loading}
                                className="rounded-full bg-amber px-4 py-2 font-mono text-xs font-medium text-ink transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Menghapus..." : confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}