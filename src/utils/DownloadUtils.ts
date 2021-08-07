export function formatSizeBytes(sizeInBytes: any) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 1; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB

    // return bytes if less than a KB
    if (sizeInBytes < kiloBytes) {
        return sizeInBytes + ' Bytes';
    }
    // return KB if less than a MB
    else if (sizeInBytes < megaBytes) {
        return (sizeInBytes / kiloBytes).toFixed(decimal) + ' KB';
    }
    // return MB if less than a GB
    else if (sizeInBytes < gigaBytes) {
        return (sizeInBytes / megaBytes).toFixed(decimal) + ' MB';
    }
    // return GB if less than a TB
    else {
        return (sizeInBytes / gigaBytes).toFixed(decimal) + ' GB';
    }
}
