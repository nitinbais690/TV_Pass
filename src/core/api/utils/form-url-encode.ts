export function formEncodedString(request: { [key: string]: any }): string {
    var formBody = [];
    for (var property in request) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(request[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
}
