import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseDateFromFilename, formatDate, setDocumentTitle, formatTitleFromFilename } from './utils';

describe('parseDateFromFilename', () => {
  it('should parse valid date from filename', () => {
    const filename = '24-01-15_local-pipelines';
    const result = parseDateFromFilename(filename);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // January is 0
    expect(result.getDate()).toBe(15);
  });

  it('should return null for invalid date format', () => {
    const filename = 'invalid-filename';
    const result = parseDateFromFilename(filename);
    expect(result).toBeNull();
  });
});

describe('formatDate', () => {
  it('should format date with default locale and options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBe('January 15, 2024');
  });

  it('should format date with custom locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    expect(result).toBe('15 jan. 2024');
  });

  it('should return null for null date', () => {
    const result = formatDate(null);
    expect(result).toBeNull();
  });
});

describe('setDocumentTitle', () => {
  const DEFAULT_TITLE = 'Original Title';

  beforeEach(() => {
    document.title = DEFAULT_TITLE;
  });

  afterEach(() => {
    document.title = DEFAULT_TITLE;
  });

  it('should set title with suffix', () => {
    setDocumentTitle('Test Page');
    expect(document.title).toBe('Test Page - Second Brain');
  });

  it('should set default title when no title provided', () => {
    setDocumentTitle();
    expect(document.title).toBe('Second Brain');
  });

  it('should use custom suffix', () => {
    setDocumentTitle('Test Page', 'Custom Suffix');
    expect(document.title).toBe('Test Page - Custom Suffix');
  });
});

describe('formatTitleFromFilename', () => {
  it('should format filename with date prefix', () => {
    const filename = '24-01-15_local-pipelines';
    const result = formatTitleFromFilename(filename);
    expect(result).toBe('Local Pipelines');
  });

  it('should format filename without date prefix', () => {
    const filename = 'local-pipelines-test';
    const result = formatTitleFromFilename(filename);
    expect(result).toBe('Local Pipelines Test');
  });

  it('should handle single word filename', () => {
    const filename = 'test';
    const result = formatTitleFromFilename(filename);
    expect(result).toBe('Test');
  });
});
