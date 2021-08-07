import { useState } from 'react';
import { useEffect } from 'react';

// const SCHEME_SEPARATOR = '//';
// const SCHEME_SEPARATOR_LEN = SCHEME_SEPARATOR.length;
// const removeDomainFromURL = (url: string): string => {
//     const schemeSeperatorIndex = url.indexOf(SCHEME_SEPARATOR);
//     if (schemeSeperatorIndex > -1) {
//         const schemeRemovedString = url.substring(schemeSeperatorIndex + SCHEME_SEPARATOR_LEN);
//         return schemeRemovedString.substring(schemeRemovedString.indexOf('/') + 1);
//     } else {
//         return url.substring(url.indexOf('/') + 1);
//     }
// };

export const useDownloadedImage = (imageURI: string, offlineID: string): string | undefined => {
    // const RNFetchBlob = NativeModules.RNFetchBlob
    const RNFetchBlob = require('rn-fetch-blob');
    const [localPath, setLocalPath] = useState<string>();
    const filePath = RNFetchBlob.fs.dirs.CacheDir + '/' + offlineID + '.jpg';
    useEffect(() => {
        async function fetchImage() {
            if (await RNFetchBlob.fs.exists(filePath)) {
                console.log(`useDownloadedImage from_cache: ${offlineID}`);
                setLocalPath(filePath);
            } else {
                console.log(`useDownloadedImage no_cache: ${offlineID}`);
            }
            //update the image once again
            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'jpg',
                path: filePath + '.tmp',
            })
                .fetch('GET', imageURI)
                .then(async (res: any) => {
                    console.log('useDownloadedImage saved_to:', res.path());
                    await RNFetchBlob.fs.mv(res.path(), filePath);
                    console.log('useDownloadedImage renamed_to:', filePath);
                    setLocalPath(filePath);
                })
                .catch((error: any) => {
                    console.log(`useDownloadedImage error: ${error}`);
                });
        }
        fetchImage();
    }, [RNFetchBlob, filePath, imageURI, offlineID]);
    return localPath;
};
