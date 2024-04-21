import axios from "axios"

const create = (name: string) => {
    return axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_HASURA_BASE_URL}${name}`,
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
        },
    })
}

export default create;