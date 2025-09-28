export function useRewriter() {
  const isSupported = "Rewriter" in self;

  return { isSupported };
}
