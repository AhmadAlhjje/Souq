// utils/searchHelpers.ts

export interface SearchTermResult {
  customerName?: string;
  productName?: string;
}

/**
 * يقوم بتحليل النص المرسل وتقسيمه إلى customerName و productName
 * 
 * @param searchTerm النص المراد تحليله
 * @returns كائن يحتوي على customerName و/أو productName
 * 
 * @example
 * parseSearchTerm("أحمد محمد") // { customerName: "أحمد محمد" }
 * parseSearchTerm("منتج: هاتف ذكي") // { productName: "هاتف ذكي" }
 * parseSearchTerm("زبون: أحمد محمد") // { customerName: "أحمد محمد" }
 * parseSearchTerm("") // {}
 */
export const parseSearchTerm = (searchTerm: string): SearchTermResult => {
  // إزالة المسافات الزائدة
  const trimmedTerm = searchTerm.trim();
  
  // إذا كان النص فارغاً
  if (!trimmedTerm) {
    return {};
  }

  // التحقق من وجود بادئة "منتج:"
  const productPrefix = "منتج:";
  if (trimmedTerm.startsWith(productPrefix)) {
    const productName = trimmedTerm.slice(productPrefix.length).trim();
    return productName ? { productName } : {};
  }

  // التحقق من وجود بادئة "زبون:"
  const customerPrefix = "زبون:";
  if (trimmedTerm.startsWith(customerPrefix)) {
    const customerName = trimmedTerm.slice(customerPrefix.length).trim();
    return customerName ? { customerName } : {};
  }

  // إذا لم توجد بادئة، يُعتبر النص اسم زبون
  return { customerName: trimmedTerm };
};

/**
 * يقوم بتنظيف وتطبيع النص للبحث
 * 
 * @param text النص المراد تنظيفه
 * @returns النص المنظف
 */
export const normalizeSearchText = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' '); // استبدال المسافات المتعددة بمسافة واحدة
};

/**
 * يتحقق من صحة المعايير المرسلة للبحث
 * 
 * @param customerName اسم الزبون
 * @param productName اسم المنتج
 * @returns true إذا كانت المعايير صحيحة
 */
export const validateSearchCriteria = (
  customerName?: string, 
  productName?: string
): boolean => {
  const hasCustomerName = Boolean(customerName && customerName.trim().length > 0);
  const hasProductName = Boolean(productName && productName.trim().length > 0);
  
  // يجب أن يكون هناك معيار واحد على الأقل
  return hasCustomerName || hasProductName;
};

/**
 * يقوم بتحليل النص وإرجاع معايير البحث المنظفة والجاهزة للإرسال
 * 
 * @param searchTerm النص المراد تحليله
 * @returns كائن يحتوي على معايير البحث المنظفة أو null إذا لم تكن صالحة
 */
export const prepareSearchCriteria = (searchTerm: string): SearchTermResult | null => {
  const parsed = parseSearchTerm(searchTerm);
  
  // تنظيف النصوص
  const cleanedCriteria: SearchTermResult = {};
  
  if (parsed.customerName) {
    const cleanCustomerName = normalizeSearchText(parsed.customerName);
    if (cleanCustomerName.length >= 2) { // الحد الأدنى طولين حرفين
      cleanedCriteria.customerName = cleanCustomerName;
    }
  }
  
  if (parsed.productName) {
    const cleanProductName = normalizeSearchText(parsed.productName);
    if (cleanProductName.length >= 2) { // الحد الأدنى طولين حرفين
      cleanedCriteria.productName = cleanProductName;
    }
  }
  
  // التحقق من صحة المعايير
  if (!validateSearchCriteria(cleanedCriteria.customerName, cleanedCriteria.productName)) {
    return null;
  }
  
  return cleanedCriteria;
};