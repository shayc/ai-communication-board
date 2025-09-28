export function useProofreader() {
  const isSupported = "Proofreader" in self;

  return { isSupported };
}
