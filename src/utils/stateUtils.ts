export const isAwaiting = (status: string | undefined | null): boolean => {
  return status?.startsWith("AWAITING") ?? false;
};
