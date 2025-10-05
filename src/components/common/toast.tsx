// components/Toast.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { hideToast } from "../../store/slices/toastSlice";

export const Toast = () => {
  const dispatch = useAppDispatch();
  const { message, type } = useAppSelector((state : any) => state.toast);

  if (!message) return null;

  return (
  <AnimatePresence>
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
    onAnimationComplete={() => setTimeout(() => dispatch(hideToast()), 3000)}
  >
    <div className="flex items-center justify-between gap-4">
      <span>{message}</span>
      <button
        onClick={() => dispatch(hideToast())}
        className="text-white font-bold"
      >
        ✕
      </button>
    </div>
  </motion.div>
</AnimatePresence>
  );
};
