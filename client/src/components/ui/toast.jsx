import { useState } from "react"

export /**
 * Active: 2026-01-08
 * Function: Toast
 */
function Toast({ message, type = "info", onClose }) {
  if (!message) return null
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg bg-white border ${type === "error" ? "border-red-400 text-red-700" : "border-gray-300 text-gray-800"}`}>
      {message}
      <button className="ml-4 text-xs underline" onClick={onClose}>Close</button>
    </div>
  )
}
