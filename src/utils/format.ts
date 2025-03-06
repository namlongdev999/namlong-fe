export const formatCurrencyVND = (num: number) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};
