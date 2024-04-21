import axios from "axios";
import { useEffect, useState } from "react";
import FormData from "form-data";
import Image from "next/image";
import create from "./axiosInstance";

const axiosSubmit = create("insert-submission");
const axiosUpdateScore = create("update-score");
const axiosFetchScore = create("teams");

const Submit = (props: any) => {
    const { itemId, teamId, setRefetchSubmissions, itemScore } = props;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [ipfsHash, setIpfsHash] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const image = e.target.files[0];
            compressImage(image);
            setSelectedImage(image);
        }        
    };

    const compressImage = (image: any) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageElement = document.createElement("img");
        imageElement.src = URL.createObjectURL(image);
        imageElement.onload = () => {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            ctx?.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
            canvas.toBlob((blob) => {
                const compressedImage = new File([blob as Blob], image.name, {
                    type: "image/jpeg",
                    lastModified: Date.now()
                });
                setSelectedImage(compressedImage);
            }, "image/jpeg", 0.7);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!selectedImage) {
            return;
        }

        setIsUploading(true);

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
                setIsUploading(false);
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

            // Insert submission into db
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

            // Update team score
            axiosFetchScore.get(`/${teamId}`).then((teamRes) => {
                console.log('team res: ', teamRes.data.teams_by_pk);
                const currScore = teamRes.data.teams_by_pk.score;
                console.log('curr score: ', currScore);
                console.log('item score: ', itemScore);
                axiosUpdateScore.post(`/${teamId}`, {
                    object: {
                        score: currScore + itemScore
                    }
                });
            });
        }
    }, [ipfsHash]);

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-[100%]"/>
            <br />
            {selectedImage && 
                <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="selected"
                    width={0}
                    height={0}
                    sizes="100vh"
                    style={{ width: '100%', height: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem' }}
                />
            }
            {selectedImage && <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={handleSubmit}>Submit</button>}
            {isUploading &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white text-2xl backdrop-blur-md">
                    Uploading... Please wait...
                </div>
            }
        </div>
    );
}

export default Submit;