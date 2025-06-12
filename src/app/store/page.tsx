export default function StorePage() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold mb-2">Store</h2>
      <ul className="w-full flex flex-col gap-4">
        <li className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded p-4">
          <span>🌙 Dark Mode</span>
          <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Redeem (100 coins)</button>
        </li>
        <li className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded p-4">
          <span>🧑‍💻 Profile Icon</span>
          <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Redeem (50 coins)</button>
        </li>
      </ul>
    </div>
  );
} 