import ImageKit from "imagekit-javascript"
// SDK initialization

var imagekit = new ImageKit({
    publicKey: "public_2Wzf7wcyP3+0ouQ8HnJnL5mK3FY=",
    urlEndpoint: "https://ik.imagekit.io/7lvwoay0t"
});


// Upload function internally uses the ImageKit.io javascript SDK
export async function uploadImage(data, number) {
    const authenticationEndpoint = "https://66aa68c22bc64fc86f20.appwrite.global/";
    const authResponse = await fetch(authenticationEndpoint);
    if (!authResponse.ok) {
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
        console.log(error);
    } finally {
        // Hide loader and overlay

    }
}