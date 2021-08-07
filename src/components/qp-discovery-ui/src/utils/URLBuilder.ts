// Note: URL and URLSearchParams are currently unavailable in RN 0.59+, so using this bare-bones implementation,
// we should eventually replace this with a more robust implementation.
export const URLBuilder = (endpoint: string, path: string | undefined, params: { [key: string]: any }): string => {
    return `${endpoint}/${path}?${queryString(params)}`;
};

export const queryString = (params: { [key: string]: any } = {}): string => {
    return Object.keys(params)
        .map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
};
