import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"
//setupVitest.js or similar file
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
import "@testing-library/jest-dom";

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();


afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})