import type { ApolloClient } from "@apollo/client";
import { getContext, setContext } from "svelte";

const CLIENT = typeof Symbol !== "undefined" ? Symbol("client") : "@@client";
const SSR = typeof Symbol !== "undefined" ? Symbol("ssr") : "@@ssr";

export function getClient<TCache = any>(): ApolloClient<TCache> {
	const client = getContext(CLIENT);

	if (!client) {
		throw new Error(
			"ApolloClient has not been set yet, use setClient(new ApolloClient({ ... })) to define it"
		);
	}

	return client as ApolloClient<TCache>;
}

export function setClient<TCache = any>(client: ApolloClient<TCache>): void {
	setContext(CLIENT, client);
}

export function getSSRContext<TCache = any>(): any {
	const ssrContext = getContext(SSR);
  return ssrContext;
}

export function setSSRContext<TCache = any>(ssrContext: any): void {
	setContext(SSR, ssrContext);
}
