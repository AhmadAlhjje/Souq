import React, { useState, useCallback } from "react";
import { TrendingUp, Package, Tag, Percent } from "lucide-react";
import Badge from "../atoms/Badge";
import ProductCard from "./ProductCard";
import OffersSlider from "./OffersSlider";
import SearchProductsWithApi from "../molecules/SearchProductsWithApi";
import ProductSearchResults from "../molecules/ProductSearchResults";
import { Product } from "@/api/storeProduct";
import { ProductSearchResponse, ApiProduct } from "../../api/stores";

interface ProductsSectionProps {
  products: Product[];
  storeId?: number;
  storeName?: string;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  storeId,
  storeName,
}) => {
  const [searchResults, setSearchResults] =
    useState<ProductSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const handleSearchResults = useCallback(
    (results: ProductSearchResponse | null) => {
      setSearchResults(results);
    },
    []
  );

  const handleSearchError = useCallback((error: string | null) => {
    setSearchError(error);
  }, []);

  const handleSearchLoading = useCallback((loading: boolean) => {
    setIsSearching(loading);
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setCurrentSearchTerm(term);
  }, []);
  const convertApiProductToLocal = useCallback(
    (apiProduct: ApiProduct): Product => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
      let imageUrl = "https://placehold.co/400x250/00C8B8/FFFFFF?text=منتج";

      const raw = apiProduct.images || (apiProduct as any).image;
      if (raw) {
        try {
          let parsed = raw;
          if (typeof parsed === "string") {
            // أزل المسافات البيضاء
            parsed = parsed.trim();
            // إذا فيه backslashes كثيرة → محتاج نفك JSON مرتين
            if (parsed.startsWith('"[') || parsed.includes("\\")) {
              parsed = JSON.parse(parsed); // أول مرة
            }
            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed); // ثاني مرة إذا لازال نص
            }
          }
          if (!Array.isArray(parsed)) parsed = [parsed];

          const first = parsed[0];
          if (first && first !== "null" && first !== "") {
            if (first.startsWith("/uploads")) imageUrl = `${baseUrl}${first}`;
            else if (first.startsWith("uploads/"))
              imageUrl = `${baseUrl}/${first}`;
            else if (first.startsWith("http")) imageUrl = first;
            else imageUrl = `${baseUrl}/uploads/${first}`;
          }
        } catch (e) {
          console.error("❌ خطأ في تحليل صور المنتج:", e, raw);
        }
      }

      // ... باقي الكائن كما هو
      return {
        id: apiProduct.product_id,
        name: apiProduct.name,
        nameAr: apiProduct.name,
        category: "عام",
        categoryAr: "عام",
        price: parseFloat(apiProduct.price),
        salePrice:
          apiProduct.has_discount && apiProduct.discounted_price
            ? apiProduct.discounted_price
            : undefined,
        originalPrice: parseFloat(apiProduct.price),
        rating: apiProduct.averageRating || 0,
        reviewCount: apiProduct.reviewsCount || 0,
        image: imageUrl,
        isNew: false,
        stock: apiProduct.stock_quantity,
        status:
          apiProduct.stock_quantity === 0
            ? "out_of_stock"
            : apiProduct.stock_quantity <= 5
            ? "low_stock"
            : "active",
        description: apiProduct.description,
        descriptionAr: apiProduct.description,
        brand: "غير محدد",
        brandAr: "غير محدد",
        sales: 0,
        inStock: apiProduct.stock_quantity > 0,
        createdAt: apiProduct.created_at,
        discountPercentage: apiProduct.discount_percentage
          ? parseFloat(String(apiProduct.discount_percentage))
          : undefined,
        discountAmount: apiProduct.discount_amount,
        hasDiscount: apiProduct.has_discount,
      };
    },
    []
  );

  const displayedProducts = searchResults
    ? searchResults.Products.map((p) => convertApiProductToLocal(p))
    : products;

  const availableProducts = displayedProducts.filter(
    (p) => p.inStock && p.stock > 0
  );
  const discountedProducts = displayedProducts.filter(
    (p) => p.hasDiscount === true
  );
  const newProducts = displayedProducts.filter((p) => p.isNew);
  const outOfStockProducts = displayedProducts.filter(
    (p) => p.status === "out_of_stock"
  );
  const lowStockProducts = displayedProducts.filter(
    (p) => p.status === "low_stock"
  );

  const averageDiscount =
    discountedProducts.length > 0
      ? Math.round(
          discountedProducts.reduce(
            (sum, p) => sum + (p.discountPercentage || 0),
            0
          ) / discountedProducts.length
        )
      : 0;

  return (
    <div className="lg:col-span-3">
      <div
        className="p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: "#CFF7EE" }}
      >
        {storeId && <OffersSlider storeId={storeId} storeName={storeName} />}

        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span>
                {storeId && storeName ? `منتجات ${storeName}` : "جميع المنتجات"}
              </span>
            </h2>
          </div>
        </div>

        {storeId && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <SearchProductsWithApi
                storeId={storeId}
                onSearchResults={handleSearchResults}
                onSearchError={handleSearchError}
                onSearchLoading={handleSearchLoading}
                onSearchTermChange={handleSearchTermChange}
                placeholder={`ابحث في منتجات ${storeName || "المتجر"}...`}
                className="w-full"
              />
              <ProductSearchResults
                searchResults={searchResults}
                searchError={searchError}
                isSearching={isSearching}
                searchTerm={currentSearchTerm}
              />
            </div>
          </div>
        )}

        {displayedProducts.length === 0 && currentSearchTerm && !isSearching ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد منتجات
            </h3>
            <p className="text-gray-500 mb-4">
              لم نجد أي منتجات تطابق بحثك عن &quot;{currentSearchTerm}&quot;
            </p>
            {storeId && storeName && (
              <p className="text-gray-400 text-sm">في متجر {storeName}</p>
            )}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-gray-500">
              {storeId && storeName
                ? `لم يتم العثور على أي منتجات في ${storeName} حالياً`
                : "لم يتم العثور على أي منتجات في هذا المتجر حالياً"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
