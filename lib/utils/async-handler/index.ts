type AsyncResult<T> = [T | null, Error | null];

export async function asyncHandler<T>(
  fn: () => PromiseLike<T>
): Promise<AsyncResult<T>> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[asyncHandler]", err.message);
    return [null, err];
  }
}

export async function asyncHandlerLoop<T, R>(
  items: T[],
  fn: (item: T) => PromiseLike<R>
): Promise<[R[], Error[]]> {
  const results: R[] = [];
  const errors: Error[] = [];

  await Promise.all(
    items.map(async (item) => {
      const [result, error] = await asyncHandler(() => fn(item));
      if (result !== null) results.push(result);
      if (error !== null) errors.push(error);
    })
  );

  return [results, errors];
}
