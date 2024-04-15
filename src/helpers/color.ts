/**
 * Hàm tăng sáng hoặc tăng tối màu sắc dựa trên một mức độ nhất định.
 * @param {string} col - Mã màu HEX.
 * @param {number} amt - Mức độ điều chỉnh (âm hoặc dương).
 * @returns {string} Mã màu HEX sau khi điều chỉnh.
 */
export const lightenDarkenColor = (col: string, amt: number): string => {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

/**
 * Chuyển đổi mã màu HEX thành mã màu RGBA với độ mờ được chỉ định.
 * @param {string} hex - Mã màu HEX.
 * @param {number} opacity - Độ mờ (từ 0 đến 1).
 * @returns {string} Mã màu RGBA.
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const bigint: number = parseInt(hex.slice(1), 16);
  const r: number = (bigint >> 16) & 255;
  const g: number = (bigint >> 8) & 255;
  const b: number = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Trả về một màu ngẫu nhiên từ một chuỗi đầu vào.
 * @param {string} text - Chuỗi đầu vào.
 * @returns {string} Mã màu HEX ngẫu nhiên.
 */
export const getRandomColorFromString = (text: string): string => {
  const colors = [
    "#ff9c6e",
    "#ff7875",
    "#ffc069",
    "#ffd666",
    "#fadb14",
    "#95de64",
    "#5cdbd3",
    "#69c0ff",
    "#85a5ff",
    "#b37feb",
    "#ff85c0",
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;

  return colors[hash];
};

/**
 * Kiểm tra màu sáng.
 * @param {string} color - Input Mã màu hex.
 * @returns {boolean} Sự thật.
 */
export const isLightColor = (color: string): boolean => {
  // Chuyển màu từ hex sang RGB
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (rgb) {
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);
    // Tính độ sáng
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Nếu độ sáng lớn hơn hoặc bằng 125 thì màu là màu sáng
    return brightness >= 125;
  }
  return false;
};
