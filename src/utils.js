import { flushSync } from "react-dom";

export const transitionViewIfSupported = (updateCb) => {
  // @ts-ignore
  if (document.startViewTransition) {
    // @ts-ignore
    document.startViewTransition(() => {
      flushSync(updateCb);
    });
  } else {
    updateCb();
  }
};

export const parseDateFromFilename = (filename) => {
  const dateMatch = filename.match(/^(\d{2})-(\d{2})-(\d{2})_/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return new Date(`20${year}-${month}-${day}`);
  }
  return null;
};

export const formatDate = (date, locale = "en-US", options = {
  year: "numeric",
  month: "long",
  day: "numeric"
}) => {
  if (!date) return null;
  return date.toLocaleDateString(locale, options);
};

export const setDocumentTitle = (title, suffix = "Second Brain") => {
  document.title = title ? `${title} - ${suffix}` : suffix;
};

export const formatTitleFromFilename = (filename) => {
  return filename
    .replace(/^\d{2}-\d{2}-\d{2}_/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
