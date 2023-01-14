import axios from "axios";

const client = axios.create({
    baseURL: "http://168.176.61.15:12005/",
});

export async function clientGet(url) {
    return await client.get(url);
}

export async function clientPost(url, body) {
    return await client.post(url, body);
}

export async function clientPut(url, body) {
    return await client.put(url, body);
}

export async function clientDelete(url) {
    return await client.delete(url);
}
