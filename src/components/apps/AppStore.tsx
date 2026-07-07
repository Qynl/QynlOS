// App Store / Installation Manager

import React, { useState } from 'react';
import { useOS } from '@/lib/os-context-windows';
import { App } from '@/lib/app-registry';

export function AppStore() {
  const { getAvailableApps, installApp, uninstallApp } = useOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const apps = getAvailableApps();

  const categories = [
    { id: 'all', name: 'All Apps' },
    { id: 'game', name: 'Games' },
    { id: 'browser', name: 'Browsers' },
    { id: 'development', name: 'Development' },
    { id: 'media', name: 'Media' },
    { id: 'utility', name: 'Utilities' },
  ];

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstall = (app: App) => {
    if (app.installed) {
      if (uninstallApp(app.id)) {
        alert(`${app.name} uninstalled successfully`);
      }
    } else {
      if (installApp(app.id)) {
        alert(`${app.name} installed successfully`);
      }
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">App Store</h1>
        <p className="opacity-90">Discover and install amazing applications</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-48 bg-white border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4 text-gray-900">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* App Icon */}
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-32 flex items-center justify-center text-6xl">
                  {app.icon}
                </div>

                {/* App Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{app.description}</p>

                  {/* Details */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>Version: {app.version}</p>
                    <p>Size: {app.size} MB</p>
                    {app.requirements?.minRam && (
                      <p>RAM: {app.requirements.minRam}GB+</p>
                    )}
                  </div>

                  {/* Install/Uninstall Button */}
                  <button
                    onClick={() => handleInstall(app)}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      app.installed
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {app.installed ? 'Uninstall' : 'Install'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">No apps found</p>
                <p>Try adjusting your search or category filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
