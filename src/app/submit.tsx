import axios from "axios";
import { useEffect, useState } from "react";
import FormData from "form-data";

const axiosSubmit = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/insert-submission",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

const axiosUpdateScore = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/update-score",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

const axiosFetchScore = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/teams",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

const Submit = (props: any) => {
    const { itemId, teamId, setRefetchSubmissions, itemScore } = props;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [ipfsHash, setIpfsHash] = useState("");
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImage(e.target.files[0]);
        }        
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!selectedImage) {
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedImage);
        console.log("formData: ", formData);

        const pinataMetadata = JSON.stringify({
            name: selectedImage.name
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 0
        });
        formData.append("pinataOptions", pinataOptions);


        try{
            axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: 10000,
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA}`
            }
            }).then((res: any) => {
                console.log(res);
                setIpfsHash(res.data.IpfsHash);
            });
        } catch (error) {
            console.log(error);
        }

        setRefetchSubmissions(true);
    }

    useEffect(() => {
        if (ipfsHash) {
            const url = process.env.NEXT_PUBLIC_IPFS_GATEWAY + ipfsHash;
            console.log("ipfs url: ", url);
            axiosSubmit.post("/", {
                object: {
                    image_url: url,
                    item_id: itemId,
                    team_id: teamId,
                    time_submitted: new Date().toISOString()
                }
            }).then((res) => {
                console.log("insert into db: ", res);
            }).catch((error) => {
                console.error(error);
            });
            axiosFetchScore.get(`/${teamId}`).then((teamRes) => {
                console.log('team res: ', teamRes.data.teams_by_pk);
                const currScore = teamRes.data.teams_by_pk.score;
                console.log('curr score: ', currScore);
                console.log('item score: ', itemScore);
                axiosUpdateScore.post(`/${teamId}`, {
                    object: {
                        score: currScore + itemScore
                    }
                }).then(() => window.location.reload());
            });
        }
    }, [ipfsHash]);

    return (
        <div>
            <input type="file" onChange={handleImageChange} className="max-w-[50%]"/>
            <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default Submit;