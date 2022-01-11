import * as nodeFetch from 'node-fetch'
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: 'jfc9jLrj-2qcjHl6t-E2vVPBNlIWcUKIqkXyXqV1GQk',
    fetch: nodeFetch.default
});

export const getPhoto = async (number) => {
    const photo = await unsplash.photos.getRandom({count: number});
    return photo;
}