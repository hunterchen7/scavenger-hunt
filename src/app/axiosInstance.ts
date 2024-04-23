import axios, { type AxiosInstance } from "axios"

const create = (name: string) => {
    return axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_HASURA_BASE_URL}${name}`,
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
        },
    })
}

const getResponse = async (axiosInstance: AxiosInstance) => {
    try {
        const response = await axiosInstance.get("/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default create;
export { getResponse };