import { MapPin, Languages } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { SUPPORTED_LANGUAGES } from '../../types/location';

export default function LocationsPage() {
  const { locations, activeLanguage, setActiveLanguage } = useLocationContext();

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <p className="text-xs text-gray-500 mt-1">Locations are loaded from the CMS database.</p>
      </div>

      {locations.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <MapPin className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No locations configured</h3>
          <p className="text-gray-400 text-xs mt-1">Create a location in the CMS to make it available here.</p>
        </div>
      ) : (
        locations.map((location) => {
          const languages = location.supportedLanguages || [];
          return (
            <div key={location.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FF0000]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">{location.name}</h2>
                    <p className="text-xs text-gray-400">{location.countryCode || location.id} · {location.status}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">{location.status}</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500">
                  <Languages className="w-4 h-4" />Available languages
                </div>
                {languages.length === 0 ? (
                  <p className="text-xs text-gray-400">No languages configured</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {languages.map(code => (
                      <button key={code} onClick={() => setActiveLanguage(code)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${activeLanguage===code?'bg-gray-900 text-white border-gray-900':'bg-white text-gray-600 border-gray-200'}`}>
                        {SUPPORTED_LANGUAGES[code]?.name || code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
