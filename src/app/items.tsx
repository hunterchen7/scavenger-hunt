import axios from "axios";
import React, { useEffect, useState } from "react";
import Submit from "./submit";
import Image from "next/image";
import { blurData } from "../../public/imgPlaceholder";

const axiosInstanceItem = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/items",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

const getItems = async () => {
    try {
        const response = await axiosInstanceItem.get("/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const axiosSubmissions = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/submissions",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

const getSubmissions = async () => {
    try {
        const response = await axiosSubmissions.get("/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const Items = (props: any) => {
    const { teamId } = props;
    const [items, setItems] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [refetchSubmissions, setRefetchSubmissions] = useState(false);

    useEffect(() => {
        getItems().then((data) => {
            console.log("items: ", data);
            setItems(data.items);
            setItemsLoading(false);
        });
        getSubmissions().then((data) => {
            console.log("submissions: ", data);
            setSubmissions(data.submissions);
            setSubmissionsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (refetchSubmissions) {
            getSubmissions().then((data) => {
                console.log("submissions: ", data);
                setSubmissions(data.submissions);
                setSubmissionsLoading(false);
            });
        }
    }, [refetchSubmissions]);

    return (
        <div>
            {itemsLoading || submissionsLoading ? <div>Loading...</div> : (
                <ul>
                    {items.sort((a, b) => a.id - b.id).map((item) => (
                        <li className="bg-purple-900 m-2 p-2 lg:p-3 rounded md:max-w-[50vw] lg:max-w-[40vw] xl:max-w-[30vw] 2xl:max-w-[25vw] 3xl:max-w-[20vw]" key={item.id}>
                            <div className="lg:mb-3">{item.id + ". " + item.item + " (" + item.points + " point" + (item.points === 1 ? "" : "s") + ")"}</div>
                            {submissions.find((submission) => submission.item_id == item.id && submission.team_id == teamId) != null ?
                                <Image
                                    src={submissions.find((submission) => submission.item_id == item.id && submission.team_id == teamId).image_url}
                                    alt="selected"
                                    placeholder="blur"
                                    blurDataURL={blurData}
                                    width={0}
                                    height={0}
                                    sizes="100vh"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            : 
                                <div>
                                    choose file to submit
                                    <Submit itemId={item.id} teamId={teamId} setRefetchSubmissions={setRefetchSubmissions} itemScore={item.points} />
                                </div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Items;