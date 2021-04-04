import type { WatchQueryOptions } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { getClient, getSSRContext } from "./context";
import { Data, observableQueryToReadable } from "./observable";
import type { ReadableQuery } from "./observable";

export function query<TData = unknown, TVariables = unknown>(
	query: DocumentNode,
	options: Omit<WatchQueryOptions<TVariables, TData>, "query"> = {}
): ReadableQuery<TData> {
	const client = getClient();
	const queryOptions = { ...options, query } as WatchQueryOptions<
		TVariables,
		TData
	>;

	// If client is restoring (e.g. from SSR), attempt synchronous readQuery first
	let initialValue: TData | undefined;
  try {
    // undefined = skip initial value (not in cache)
    initialValue = client.readQuery(queryOptions) || undefined;
  } catch (err) {
    // Ignore preload errors
  }

	const observable = client.watchQuery<TData, TVariables>(queryOptions);
  
  const ssrContext = getSSRContext();

  if (ssrContext) {
    if (!ssrContext.queries) {
      ssrContext.queries = [];
    }
    ssrContext.queries.push(observable.result());
  }

	const store = observableQueryToReadable(
		observable,
		initialValue !== undefined
			? ({
					data: initialValue,
			  } as Data<TData>)
			: undefined
	);

	return store;
}
