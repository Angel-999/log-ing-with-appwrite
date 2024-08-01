import ImageKit from "imagekit-javascript"
import { Notyf } from 'notyf';
// SDK initialization
const notyf = new Notyf({
    duration: 2500,
    position: {
        x: 'right',
        y: 'bottom',
    }
});
var imagekit = new ImageKit({
    publicKey: "public_2Wzf7wcyP3+0ouQ8HnJnL5mK3FY=",
    urlEndpoint: "https://ik.imagekit.io/7lvwoay0t"
});


// Upload function internally uses the ImageKit.io javascript SDK
export async function uploadImage(data, number) {
    const imageNotyf = notyf.loading('Uploading image...');
    const authenticationEndpoint = "https://66aa68c22bc64fc86f20.appwrite.global/";
    const authResponse = await fetch(authenticationEndpoint);
    if (!authResponse.ok) {
        notyf.error('Failed to upload image: ' + authResponse.statusText);
        notyf.dismiss(imageNotyf);  
        throw new Error("Failed to fetch auth details");
    }
    const authData = await authResponse.json();
    // Show loader and overlay

    try {
        const response = await imagekit.upload({
            file: data, //required
            fileName: `IMG_${number}`,   //required
            folder: "trucks",
            useUniqueFileName: false,
            token: authData.token,
            signature: authData.signature,
            expire: authData.expire,
        });
        return response.url;
    } catch (error) {
        notyf.error('Failed to upload image": ' + error);
        notyf.dismiss(imageNotyf);
    } finally {
        // Hide loader and overlay
        notyf.dismiss(imageNotyf);
    }
}