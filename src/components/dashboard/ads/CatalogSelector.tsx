import React from 'react';
import { Check, Plus, CheckCircle } from 'lucide-react';
import { 
  PRODUCT_CATALOG, 
  ADDON_CATALOG, 
  ProductId, 
  AddonId, 
  CampaignOrderItem 
} from '../../../types/campaign';

interface CatalogSelectorProps {
  items: CampaignOrderItem[];
  onAddProduct: (productId: ProductId) => void;
  onAddAddon: (addonId: AddonId) => void;
}

export const CatalogSelector: React.FC<CatalogSelectorProps> = ({
  items,
  onAddProduct,
  onAddAddon
}) => {
  const isProductSelected = (productId: ProductId) => {
    return items.some(i => i.type === 'product' && i.productId === productId);
  };

  const isAddonSelected = (addonId: AddonId) => {
    return items.some(i => i.type === 'addon' && i.addonId === addonId);
  };

  return (
    <div className="space-y-6 font-['Inter']">
      
      {/* Products Catalog Cards */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          1. Select Ad Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCT_CATALOG.map((product) => {
            const selected = isProductSelected(product.id);

            return (
              <div
                key={product.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  selected 
                    ? 'border-gray-900 bg-gray-50/50 shadow-sm ring-1 ring-gray-900' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                    {selected && (
                      <span className="p-1 bg-gray-900 text-white rounded-full shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="text-lg font-bold text-gray-900">
                    ${product.price.toLocaleString()} <span className="text-xs font-semibold text-gray-500">USD</span>
                  </div>

                  {/* Inclusions Checklist */}
                  <ul className="space-y-1.5 pt-1 text-xs text-gray-600 font-medium">
                    {product.inclusions.map((inclusion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>

                  {product.maxQuantity === 1 && (
                    <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Max quantity: 1 per campaign order
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onAddProduct(product.id)}
                  disabled={selected && product.maxQuantity === 1}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    selected
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  {selected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{product.allowsMultiQuantity ? 'Add Another Package' : 'Added to Order'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product Package</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Add-ons bound to selected products */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          2. Product-Bound & Campaign Add-ons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADDON_CATALOG.map((addon) => {
            const isParentSelected = addon.parentProductId === 'campaign_wide' || 
              items.some(i => i.type === 'product' && i.productId === addon.parentProductId);
            
            const selected = isAddonSelected(addon.id);

            return (
              <div
                key={addon.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  !isParentSelected
                    ? 'opacity-40 border-gray-200 bg-gray-50'
                    : selected
                    ? 'border-blue-400 bg-blue-50/40'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="font-semibold text-xs text-gray-900 block truncate">{addon.name}</span>
                  <span className="text-xs font-bold text-gray-700 block">
                    +${addon.price} USD {addon.unitLabel ? <span className="text-[10px] text-gray-400 font-normal">({addon.unitLabel})</span> : ''}
                  </span>
                  {!isParentSelected && (
                    <span className="text-[10px] text-gray-400 block font-normal">
                      Requires parent product
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!isParentSelected}
                  onClick={() => onAddAddon(addon.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    !isParentSelected
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selected
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {selected ? (addon.allowsMultiQuantity ? '+ Qty' : 'Selected') : '+ Add'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CatalogSelector;
