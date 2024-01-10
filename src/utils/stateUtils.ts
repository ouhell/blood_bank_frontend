export const isAwaiting = (status: string | undefined | null): boolean => {
  return status?.startsWith("AWAITING") ?? false;
};

export const isPending = (status: string | undefined | null): boolean => {
  return status?.startsWith("PENDING") ?? false;
};
