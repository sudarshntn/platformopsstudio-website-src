import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearConsent, getConsent, setConsent } from "@/lib/consent";

/**
 * lib/consent runs in the browser, so we stub the minimum window +
 * localStorage surface before each test.
 */
type FakeStorage = Storage & { readonly _data: Map<string, string> };

function makeFakeStorage(): FakeStorage {
  const data = new Map<string, string>();
  const s: Partial<Storage> & { _data: Map<string, string> } = {
    _data: data,
    getItem(k: string) {
      return data.has(k) ? (data.get(k) as string) : null;
    },
    setItem(k: string, v: string) {
      data.set(k, v);
    },
    removeItem(k: string) {
      data.delete(k);
    },
    clear() {
      data.clear();
    },
    get length() {
      return data.size;
    },
    key(i: number) {
      return Array.from(data.keys())[i] ?? null;
    },
  };
  return s as FakeStorage;
}

describe("lib/consent", () => {
  beforeEach(() => {
    const win = {
      localStorage: makeFakeStorage(),
      dispatchEvent: vi.fn(),
      // CustomEvent is available in Node 22.
      CustomEvent,
    } as unknown as Window & typeof globalThis;
    vi.stubGlobal("window", win);
  });

  it("returns null when no preference stored", () => {
    expect(getConsent()).toBeNull();
  });

  it("round-trips accepted", () => {
    setConsent("accepted");
    expect(getConsent()).toBe("accepted");
  });

  it("round-trips declined", () => {
    setConsent("declined");
    expect(getConsent()).toBe("declined");
  });

  it("clears the stored preference", () => {
    setConsent("accepted");
    clearConsent();
    expect(getConsent()).toBeNull();
  });

  it("dispatches a consentchange event on set", () => {
    const dispatch = window.dispatchEvent as unknown as ReturnType<typeof vi.fn>;
    setConsent("declined");
    expect(dispatch).toHaveBeenCalled();
    const [event] = dispatch.mock.calls[0] as [CustomEvent];
    expect(event.type).toBe("consentchange");
    expect(event.detail).toBe("declined");
  });
});
