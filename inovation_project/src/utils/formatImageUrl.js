const API_URL = import.meta.env.VITE_API_URL || "https://portal-talitabresolin.onrender.com";
 
export function formatImageUrl(url) {
  if (!url) return null;

 
  if (url.includes("localhost:3000")) {
    return url.replace(/https?:\/\/localhost:3000/, API_URL);
  }

 
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
 
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default API_URL;