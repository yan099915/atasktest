"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // const [repositories, setRepositories] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [repositories, setRepositories] = useState<Record<number, any[]>>({});
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);

  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Username cannot be empty.");
      setUsers([]);
      return;
    }

    setError("");
    const res = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`);
    const data = await res.json();
    setUsers(data.items || []);
  };

  const handleGetRepositories = async (userId: number, username: string) => {
    const isSameUser = expandedUserId === userId;

    setExpandedUserId(isSameUser ? null : userId);

    if (isSameUser || repositories[userId]) return;

    setLoadingRepoId(userId);
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await res.json();

    setRepositories((prev) => ({ ...prev, [userId]: data }));
    setLoadingRepoId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
        <form onSubmit={handleSearchUsers} className="space-y-4">
          <div>
            <input
              type="text"
              name="query"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter username"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button name="search" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Search
          </button>
        </form>
        {/* user list */}
        {users.length > 0 && (
          <div className="mt-4 space-y-2 flex-1 overflow-y-auto no-scrollbar ">
            {users.map((user: any) => (
              <div key={user.id} className="group flex flex-col">
                <div
                  onClick={() => handleGetRepositories(user.id, user.login)}
                  className="flex cursor-pointer p-2 items-center justify-between rounded-lg border border-gray-200"
                >
                  <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
                  <a role="user" href={user.html_url} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium hover:underline">
                    {user.login}
                  </a>
                  <svg
                    className={"h-4 w-5 " + (expandedUserId === user.id ? "rotate-180" : "rotate-0") + " transition-transform duration-1000"}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedUserId === user.id ? "max-h-[99999px]" : "max-h-0"
                  } rounded-lg mt-1`}
                >
                  <div className="px-1 space-y-1">
                    {loadingRepoId === user.id ? (
                      <p className="text-sm text-center text-gray-500 animate-pulse">Loading repositories...</p>
                    ) : repositories[user.id]?.length === 0 ? (
                      <p className="text-sm text-center text-gray-500">No repositories found for this user.</p>
                    ) : (
                      repositories[user.id]?.map((repo) => (
                        <div key={repo.id} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between">
                            <a href={repo.html_url} target="_blank" className="hover:underline">
                              {repo.name}
                            </a>
                            <div className="flex gap-1 justify-center items-center">
                              <p>{repo.watchers}</p>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-4" viewBox="0 0 576 512">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{repo.description ?? "No description"}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
