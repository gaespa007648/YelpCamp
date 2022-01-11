import * as nodeFetch from 'node-fetch'
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: 'Your public key on Unsplash',
    fetch: nodeFetch.default
});

export const getPhoto = async (number) => {
    const photo = await unsplash.photos.getRandom({count: number});
    return photo;
}
