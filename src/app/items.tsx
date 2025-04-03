import create, { getResponse } from "./axiosInstance";
import React, { useEffect, useState } from "react";
import Submit from "./submit";
import Image from "next/image";
import { blurData } from "../../public/imgPlaceholder";

const axiosInstanceItem = create("items");
const axiosSubmissions = create("submissions");

const getItems = async () => getResponse(axiosInstanceItem);
const getSubmissions = async () => getResponse(axiosSubmissions);

type item = {
    id: number;
    item: string;
    points: number;
}

type submission = {
    team_id: number;
    item_id: number;
    image_url: string;
    time_submitted: string;
}

const Items = (props: {teamId: number | string}) => {
    const { teamId } = props;
    const [items, setItems] = useState<item[]>([]);
    const [submissions, setSubmissions] = useState<submission[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [refetchSubmissions, setRefetchSubmissions] = useState(false);

    const minItemId = Math.min(...items.map((item) => item.id));

    // fetch items and submissions
    const getAndUpdateItemsAndSubmissions = () => {
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
    }

    // set flag to refetch submissions every 5 seconds
    useEffect(() => {
        setRefetchSubmissions(true);

        const intervalId = setInterval(() => {
            setRefetchSubmissions(true);
        }, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    // fetch items and submissions when refetchSubmissions becomes true
    useEffect(() => {
        if (refetchSubmissions) {
            getAndUpdateItemsAndSubmissions();
            setRefetchSubmissions(false);
        }
    }, [refetchSubmissions]);

    return (
        <div>
            {itemsLoading || submissionsLoading ? <div>Loading...</div> : (
                <ul>
                    {items.sort((a, b) => a.id - b.id).map((item) => (
                        <li className="bg-purple-900 m-2 p-2 lg:p-3 rounded md:max-w-[50vw] lg:max-w-[40vw] xl:max-w-[30vw] 2xl:max-w-[25vw] 3xl:max-w-[20vw]" key={item.id}>
                            <div className="lg:mb-3">{item.id - minItemId + 1 + ". " + item.item + " (" + item.points + " point" + (item.points === 1 ? "" : "s") + ")"}</div>
                            {submissions.find((submission) => submission.item_id == item.id && submission.team_id == teamId) != null ?
                                <Image
                                    src={submissions.find((submission) => submission.item_id == item.id && submission.team_id == teamId)?.image_url as string}
                                    alt="selected"
                                    placeholder="blur"
                                    blurDataURL={blurData}
                                    width={600}
                                    height={600}
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