import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Upload, 
  X, 
  FileText, 
  Calendar as CalendarIcon, 
  AtSign, 
  Info,
  Clock
} from 'lucide-react';
import DatePicker from '../../common/DatePicker';
import TimePicker from '../../common/TimePicker';
import { 
  CampaignIntakeSpecs, 
  EventDaySchedule, 
  VenueLocation, 
  PRESET_VENUES,
  calculateDistanceKm,
  calculateDistanceSurcharge,
  formatDistanceSurchargeText,
  ProductId
} from '../../../types/campaign';

interface CampaignIntakeFormProps {
  selectedProducts: ProductId[];
  extraDayQty: number; // qty of addon_event_extra_day
  specs: CampaignIntakeSpecs;
  onChangeSpecs: (updatedSpecs: CampaignIntakeSpecs) => void;
}

export const CampaignIntakeForm: React.FC<CampaignIntakeFormProps> = ({
  selectedProducts,
  extraDayQty,
  specs,
  onChangeSpecs
}) => {
  const [venueQuery, setVenueQuery] = useState('');
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);

  const hasEventProduct = selectedProducts.includes('prod_event_package');
  const hasInCarouselProduct = selectedProducts.includes('prod_in_carousel_ig');
  const hasFeaturedArticleProduct = selectedProducts.includes('prod_featured_article');

  // Handle Handle Tag input change (Only 1 tag permitted, formatted as @brand)
  const formatSingleHandleTag = (val: string): string => {
    let clean = val.trim().replace(/\s+/g, '');
    if (clean && !clean.startsWith('@')) {
      clean = '@' + clean;
    }
    // ensure only 1 tag by taking the first tag if multiple @ are typed or pasted
    const parts = clean.split('@').filter(Boolean);
    if (parts.length > 0) {
      return '@' + parts[0];
    }
    return clean;
  };

  const handleInstagramTagChange = (field: 'eventInstagramTag' | 'carouselInstagramTag', rawVal: string) => {
    const formatted = formatSingleHandleTag(rawVal);
    onChangeSpecs({
      ...specs,
      [field]: formatted
    });
  };

  // Schedule Days: Day 1 (Main Event) + Day N (Extra Day Coverage) based on extraDayQty
  const totalDays = 1 + (extraDayQty || 0);
  const currentSchedules = specs.eventSchedules || [];

  // Ensure schedule array matches totalDays length
  const scheduleDays: EventDaySchedule[] = Array.from({ length: totalDays }, (_, i) => {
    const dayLabel = i === 0 ? 'Day 1 (Main Event)' : `Day ${i + 1} (Extra Day Coverage)`;
    const existing = currentSchedules[i];
    return {
      dayLabel,
      date: existing?.date || '',
      startTime: existing?.startTime || '10:00',
      endTime: existing?.endTime || '18:00'
    };
  });

  const updateScheduleDay = (index: number, updatedField: Partial<EventDaySchedule>) => {
    const updatedSchedules = [...scheduleDays];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      ...updatedField
    };
    onChangeSpecs({
      ...specs,
      eventSchedules: updatedSchedules
    });
  };

  // Venue Selection
  const handleSelectVenue = (venue: typeof PRESET_VENUES[0]) => {
    const dist = calculateDistanceKm(venue.lat, venue.lng);
    const surcharge = calculateDistanceSurcharge(dist);
    const venueLoc: VenueLocation = {
      name: venue.name,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng,
      distanceKm: dist,
      surchargeAmount: surcharge
    };
    setVenueQuery(venue.name);
    setShowVenueDropdown(false);
    onChangeSpecs({
      ...specs,
      venueLocation: venueLoc
    });
  };

  const handleCustomVenueSelect = (name: string, lat: number, lng: number) => {
    const dist = calculateDistanceKm(lat, lng);
    const surcharge = calculateDistanceSurcharge(dist);
    const venueLoc: VenueLocation = {
      name,
      lat,
      lng,
      distanceKm: dist,
      surchargeAmount: surcharge
    };
    onChangeSpecs({
      ...specs,
      venueLocation: venueLoc
    });
  };

  // Asset Upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      const newAssets = filesArray.map((file: File, idx: number) => ({
        id: `asset_${Date.now()}_${idx}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      onChangeSpecs({
        ...specs,
        creativeAssets: [...(specs.creativeAssets || []), ...newAssets]
      });
    }
  };

  const handleRemoveAsset = (id: string) => {
    onChangeSpecs({
      ...specs,
      creativeAssets: (specs.creativeAssets || []).filter(a => a.id !== id)
    });
  };

  const filteredVenues = PRESET_VENUES.filter(v =>
    v.name.toLowerCase().includes(venueQuery.toLowerCase()) ||
    v.address.toLowerCase().includes(venueQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-['Inter']">
      
      {/* 1. Event Specifications */}
      {hasEventProduct && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <CalendarIcon className="w-4 h-4 text-gray-900" />
            <h3 className="text-sm font-bold text-gray-900">Event Specifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Title */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">
                Event Title / Name
              </label>
              <input
                type="text"
                value={specs.eventTitle || ''}
                onChange={(e) => onChangeSpecs({ ...specs, eventTitle: e.target.value })}
                placeholder="e.g. Grand Opening Gala 2026"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Event Instagram Handle Tag */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 flex items-center justify-between">
                <span>Instagram Handle Tag</span>
                <span className="text-[10px] text-gray-400 font-normal">Only 1 tag permitted</span>
              </label>
              <div className="relative flex items-center">
                <AtSign className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={specs.eventInstagramTag || ''}
                  onChange={(e) => handleInstagramTagChange('eventInstagramTag', e.target.value)}
                  placeholder="@yourbrand"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Event Schedule Days */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Event Schedule
            </span>
            <div className="space-y-3">
              {scheduleDays.map((day, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-gray-900 block">
                    {day.dayLabel}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <DatePicker
                      id={`schedule-date-${idx}`}
                      label="Event Date"
                      value={day.date}
                      onChange={(dateVal) => updateScheduleDay(idx, { date: dateVal })}
                    />
                    <TimePicker
                      id={`schedule-start-${idx}`}
                      label="Start Time"
                      value={day.startTime}
                      onChange={(timeVal) => updateScheduleDay(idx, { startTime: timeVal })}
                    />
                    <TimePicker
                      id={`schedule-end-${idx}`}
                      label="End Time"
                      value={day.endTime}
                      onChange={(timeVal) => updateScheduleDay(idx, { endTime: timeVal })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Location Search & Google Maps distance calculation */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-gray-700">
              Venue Location Search & Google Maps Distance Calculation
            </label>
            <div className="relative">
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={venueQuery || (specs.venueLocation?.name || '')}
                  onChange={(e) => {
                    setVenueQuery(e.target.value);
                    setShowVenueDropdown(true);
                  }}
                  onFocus={() => setShowVenueDropdown(true)}
                  placeholder="Search venue name or location in Lebanon..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Venue Dropdown */}
              {showVenueDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {filteredVenues.length === 0 ? (
                    <div className="p-3 text-xs text-gray-400">
                      No matching venue. Click below to use typed location:
                      <button
                        type="button"
                        onClick={() => {
                          handleCustomVenueSelect(venueQuery || 'Custom Venue', 33.8969, 35.5017);
                          setShowVenueDropdown(false);
                        }}
                        className="block mt-1 font-semibold text-primary hover:underline"
                      >
                        Set "{venueQuery}" (Beirut Zone - $0)
                      </button>
                    </div>
                  ) : (
                    filteredVenues.map((venue, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectVenue(venue)}
                        className="w-full text-left p-2.5 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-xs text-gray-900 block">{venue.name}</span>
                          <span className="text-[10px] text-gray-500">{venue.address}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {calculateDistanceKm(venue.lat, venue.lng)}km from Beirut
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Plain text display without banner borders or icons */}
            {specs.venueLocation && (
              <p className="text-xs font-medium text-gray-800 pt-1">
                {formatDistanceSurchargeText(specs.venueLocation.distanceKm)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. In-Carousel Specifications */}
      {hasInCarouselProduct && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <AtSign className="w-4 h-4 text-gray-900" />
            <h3 className="text-sm font-bold text-gray-900">In-Carousel Specifications</h3>
          </div>

          <div className="space-y-1 max-w-md">
            <label className="block text-xs font-semibold text-gray-700 flex items-center justify-between">
              <span>Instagram Handle Tag</span>
              <span className="text-[10px] text-gray-400 font-normal">Only 1 tag permitted</span>
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={specs.carouselInstagramTag || ''}
                onChange={(e) => handleInstagramTagChange('carouselInstagramTag', e.target.value)}
                placeholder="@yourbrand"
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Featured Article Specifications */}
      {hasFeaturedArticleProduct && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-gray-900" />
            <h3 className="text-sm font-bold text-gray-900">Featured Article Specifications</h3>
          </div>

          <div className="max-w-md">
            <DatePicker
              id="article-publish-date"
              label="Preferred Target Publish Date"
              value={specs.articleTargetPublishDate || ''}
              onChange={(dateVal) => onChangeSpecs({ ...specs, articleTargetPublishDate: dateVal })}
            />
          </div>
        </div>
      )}

      {/* 4. Campaign Notes & Assets */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Info className="w-4 h-4 text-gray-900" />
          <h3 className="text-sm font-bold text-gray-900">Campaign Notes & Assets</h3>
        </div>

        {/* Textarea rows={8} description "Adding as much information as possible is helpful" */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">
            Campaign Objectives & Notes
          </label>
          <p className="text-[11px] text-gray-500 font-normal">
            Adding as much information as possible is helpful
          </p>
          <textarea
            rows={8}
            value={specs.campaignObjectivesNotes || ''}
            onChange={(e) => onChangeSpecs({ ...specs, campaignObjectivesNotes: e.target.value })}
            placeholder="Describe key campaign goals, brand tone, key message points, target audience, or special instructions..."
            className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Creative Asset Upload file list ("Upload Creative Assets") */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-gray-700">
            Upload Creative Assets
          </label>
          
          <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 p-4 rounded-xl text-center transition-colors">
            <input
              type="file"
              id="creative-asset-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="creative-asset-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-900">Upload Creative Assets</span>
              <span className="text-[10px] text-gray-400">PNG, JPG, MP4, PDF or ZIP files supported</span>
            </label>
          </div>

          {/* Uploaded File List */}
          {specs.creativeAssets && specs.creativeAssets.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-gray-700 block">Uploaded Files:</span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {specs.creativeAssets.map((asset) => (
                  <div key={asset.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-semibold text-gray-800 truncate">{asset.name}</span>
                      {asset.size && <span className="text-[10px] text-gray-400 shrink-0">({asset.size})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Remove asset"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CampaignIntakeForm;
