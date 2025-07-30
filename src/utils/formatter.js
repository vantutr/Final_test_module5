export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB");
};
