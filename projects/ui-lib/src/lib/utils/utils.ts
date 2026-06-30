export const HTTP_STATUS_CODES: Record<number | string, string> = {
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',
	103: 'Early Hints',
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	203: 'Non-Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi-Status',
	208: 'Already Reported',
	226: 'IM Used',
	300: 'Multiple Choices',
	301: 'Moved Permanently',
	302: 'Found',
	303: 'See Other',
	304: 'Not Modified',
	305: 'Use Proxy',
	306: '(Unused)',
	307: 'Temporary Redirect',
	308: 'Permanent Redirect',
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Payload Too Large',
	414: 'URI Too Long',
	415: 'Unsupported Media Type',
	416: 'Range Not Satisfiable',
	417: 'Expectation Failed',
	418: "I'm a teapot",
	421: 'Misdirected Request',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	425: 'Too Early',
	426: 'Upgrade Required',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	431: 'Request Header Fields Too Large',
	451: 'Unavailable For Legal Reasons',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',
	507: 'Insufficient Storage',
	508: 'Loop Detected',
	510: 'Not Extended',
	511: 'Network Authentication Required',
};

export type HttpRequestOptions = {
	headers?: Record<string, string>;
	responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
};

const ACCEPT_JSON = 'application/json';

export const JSON_HTTP_OPTIONS = {
	headers: {
		Accept: ACCEPT_JSON,
	},
	responseType: 'json',
} as const satisfies HttpRequestOptions;

export const STRING_HTTP_OPTIONS = {
	responseType: 'text',
} as const satisfies HttpRequestOptions;

export const BLOB_HTTP_OPTIONS = {
	headers: {
		'Content-Type': 'application/octet-stream',
	},
	responseType: 'blob',
} as const satisfies HttpRequestOptions;

export const SKIP_ERROR_OPTIONS = {
	headers: {
		Accept: ACCEPT_JSON,
		'X-Skip-Error': 'true',
	},
	responseType: 'json',
} as const satisfies HttpRequestOptions;

export const JSON_OPTIONS_WITH_GLOBAL_LOADER = {
	headers: {
		Accept: ACCEPT_JSON,
		'X-Global-Loader': 'true',
	},
	responseType: 'json',
} as const satisfies HttpRequestOptions;

/**
 * Returns a copy of the given request options with an `Accept-Language` header,
 * letting consuming apps opt into a locale instead of having one baked into the
 * library.
 */
export function withAcceptLanguage<T extends HttpRequestOptions>(
	options: T,
	language: string,
): T & { headers: Record<string, string> } {
	return {
		...options,
		headers: {
			...(options.headers ?? {}),
			'Accept-Language': language,
		},
	};
}
