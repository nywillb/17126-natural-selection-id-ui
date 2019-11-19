
const baseurl = "/api/"

export async function get(endpoint: string) {
    let response = await fetch(baseurl + endpoint);
    return await response.json();
}