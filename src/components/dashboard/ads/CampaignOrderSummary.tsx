import React from 'react';
import { Plus, Minus, Trash2, CheckCircle2, CornerDownRight } from 'lucide-react';
import { 
  PRODUCT_CATALOG, 
  ADDON_CATALOG, 
  ProductId, 
  AddonId, 
  CampaignOrderItem,
  VenueLocation,
  calculateDistanceSurcharge,
  formatDistanceSurchargeText
} from '../../../types/campaign';

interface CampaignOrderSummaryProps {
  items: CampaignOrderItem[];
  venueLocation?: VenueLocation;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onAddProduct: (productId: ProductId) => void;
  onAddAddon: (addonId: AddonId) => void;
}

export const CampaignOrderSummary: React.FC<CampaignOrderSummaryProps> = ({
  items,
  venueLocation,
  onUpdateQuantity,
  onRemoveItem,
  onAddProduct,
  onAddAddon
}) => {
  // Separate products and add-ons
  const productItems = items.filter(i => i.type === 'product');

  // Calculate distance surcharge if event package is present
  const hasEventProduct = productItems.some(p => p.productId === 'prod_event_package');
  const distanceKm = venueLocation?.distanceKm || 0;
  const distanceSurcharge = hasEventProduct ? calculateDistanceSurcharge(distanceKm) : 0;

  // Calculate subtotal and grand total
  const itemsSubtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const grandTotal = itemsSubtotal + distanceSurcharge;

  // Find add-ons for a specific parent product
  const getAddonsForProduct = (productId: ProductId) => {
    return items.filter(i => i.type === 'addon' && i.parentProductId === productId);
  };

  // Find campaign-wide add-ons
  const campaignWideAddons = items.filter(i => i.type === 'addon' && (i.parentProductId === 'campaign_wide' || !i.parentProductId));

  // Find available add-ons that can be added for a parent product
  const getAvailableAddonsForProduct = (productId: ProductId) => {
    return ADDON_CATALOG.filter(a => a.parentProductId === productId && !items.some(i => i.addonId === a.id));
  };

  // Find available campaign-wide add-ons
  const availableCampaignAddons = ADDON_CATALOG.filter(a => a.parentProductId === 'campaign_wide' && !items.some(i => i.addonId === a.id));

  // Helper text for add-ons
  const getAddonBadgeText = (item: CampaignOrderItem) => {
    if (item.addonId === 'addon_additional_100k_impressions') {
      return `${(1 + item.quantity) * 100}k impressions guaranteed`;
    }
    if (item.addonId === 'addon_event_highlight_7d') {
      return `${item.quantity * 7} Days duration`;
    }
    if (item.addonId === 'addon_event_extra_day') {
      return `${item.quantity} extra day${item.quantity > 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6 font-['Inter']">
      
      {/* Header & Copy */}
      <div className="border-b border-gray-100 pb-4 space-y-1">
        <h2 className="text-lg font-bold text-gray-900">Campaign Order Summary</h2>
        <p className="text-xs text-gray-500 font-medium">
          Review your campaign order summary and complete payment to launch.
        </p>
      </div>

      {/* Order Items Table with Grouped and Indented Add-ons */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-3 pl-4">Item & Package Details</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 pr-4 text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {productItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No products selected in campaign order. Select products from catalog below.
                </td>
              </tr>
            ) : (
              productItems.map((prodItem) => {
                const catalogProd = PRODUCT_CATALOG.find(p => p.id === prodItem.productId);
                const boundAddons = getAddonsForProduct(prodItem.productId as ProductId);
                const availableAddons = getAvailableAddonsForProduct(prodItem.productId as ProductId);

                return (
                  <React.Fragment key={prodItem.id}>
                    {/* Parent Product Row */}
                    <tr className="bg-gray-50/40 hover:bg-gray-50 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="space-y-1">
                          <span className="font-bold text-gray-900 text-sm block">
                            {prodItem.name}
                          </span>
                          {catalogProd?.inclusions && catalogProd.inclusions.length > 0 && (
                            <ul className="space-y-0.5 text-[11px] text-gray-500 font-normal">
                              {catalogProd.inclusions.map((inc, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>

                      {/* Quantity Control */}
                      <td className="p-3 text-center align-top pt-4">
                        {catalogProd?.maxQuantity === 1 ? (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                            1 (Max)
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-lg p-1 border border-gray-200">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(prodItem.id, prodItem.quantity - 1)}
                              disabled={prodItem.quantity <= 1}
                              className="p-1 hover:bg-white rounded text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-900">{prodItem.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(prodItem.id, prodItem.quantity + 1)}
                              className="p-1 hover:bg-white rounded text-gray-700 cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-right align-top pt-4 font-semibold text-gray-600">
                        ${prodItem.unitPrice.toLocaleString()} USD
                      </td>

                      <td className="p-3 text-right align-top pt-4 font-bold text-gray-900">
                        ${prodItem.totalPrice.toLocaleString()} USD
                      </td>

                      <td className="p-3 pr-4 text-center align-top pt-4">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(prodItem.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove product and bound add-ons"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Grouped and Indented Bound Add-ons */}
                    {boundAddons.map((addonItem) => {
                      const catalogAddon = ADDON_CATALOG.find(a => a.id === addonItem.addonId);
                      const badgeText = getAddonBadgeText(addonItem);

                      return (
                        <tr key={addonItem.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                          <td className="p-3 pl-8">
                            <div className="flex items-start gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-800 text-xs">
                                    {addonItem.name}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                    Add-on
                                  </span>
                                </div>
                                {badgeText && (
                                  <span className="text-[10px] text-gray-500 font-normal block">
                                    {badgeText}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3 text-center align-top pt-3">
                            {catalogAddon?.allowsMultiQuantity ? (
                              <div className="inline-flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(addonItem.id, addonItem.quantity - 1)}
                                  disabled={addonItem.quantity <= 1}
                                  className="p-1 hover:bg-white rounded text-gray-700 disabled:opacity-30 cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center font-bold text-gray-900">{addonItem.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(addonItem.id, addonItem.quantity + 1)}
                                  className="p-1 hover:bg-white rounded text-gray-700 cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[11px] font-semibold">
                                1
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right align-top pt-3 text-gray-500">
                            ${addonItem.unitPrice.toLocaleString()} USD
                          </td>

                          <td className="p-3 text-right align-top pt-3 font-semibold text-gray-900">
                            ${addonItem.totalPrice.toLocaleString()} USD
                          </td>

                          <td className="p-3 pr-4 text-center align-top pt-3">
                            <button
                              type="button"
                              onClick={() => onRemoveItem(addonItem.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Remove add-on"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Quick Add Available Add-ons Selector under parent product */}
                    {availableAddons.length > 0 && (
                      <tr className="bg-white">
                        <td colSpan={5} className="p-2 pl-8 border-b border-gray-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">
                              Add Product Add-ons:
                            </span>
                            {availableAddons.map(a => (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => onAddAddon(a.id)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-gray-500" />
                                <span>{a.name} (+${a.price})</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}

            {/* Campaign-Wide Add-ons Section */}
            {campaignWideAddons.map((addonItem) => (
              <tr key={addonItem.id} className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                <td className="p-3 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-xs">{addonItem.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                      Campaign-Wide
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center text-gray-600">1</td>
                <td className="p-3 text-right text-gray-600">${addonItem.unitPrice.toLocaleString()} USD</td>
                <td className="p-3 text-right font-bold text-gray-900">${addonItem.totalPrice.toLocaleString()} USD</td>
                <td className="p-3 pr-4 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(addonItem.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Available Campaign-Wide Add-ons Selector */}
            {availableCampaignAddons.length > 0 && (
              <tr className="bg-gray-50/30">
                <td colSpan={5} className="p-2.5 pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">
                      Campaign Add-ons:
                    </span>
                    {availableCampaignAddons.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => onAddAddon(a.id)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{a.name} (+${a.price})</span>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Breakdown Table */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl max-w-md ml-auto space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-600 font-medium">
          <span>Packages & Add-ons Subtotal</span>
          <span>${itemsSubtotal.toLocaleString()} USD</span>
        </div>

        {/* Distance Surcharge displayed as a standard plain line item in order totals */}
        {hasEventProduct && (
          <div className="flex items-center justify-between text-gray-800 font-medium pt-1 border-t border-gray-200/60">
            <div>
              <span className="block font-semibold">Distance Surcharge</span>
              {venueLocation && (
                <span className="text-[10px] text-gray-500 block font-normal">
                  {formatDistanceSurchargeText(venueLocation.distanceKm)}
                </span>
              )}
            </div>
            <span className="font-semibold">${distanceSurcharge.toLocaleString()} USD</span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-900 font-bold text-sm pt-2 border-t border-gray-300">
          <span>Total Campaign Investment</span>
          <span className="text-base text-primary">${grandTotal.toLocaleString()} USD</span>
        </div>
      </div>

    </div>
  );
};

export default CampaignOrderSummary;
