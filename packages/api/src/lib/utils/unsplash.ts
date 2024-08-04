import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY ?? "",
});

export const getRandomPhotoFromQuery = async (query: string) => {
  const result = await unsplash.photos.getRandom({
    query,
    count: 1,
  });
  if (result.errors) {
    // handle error here
    console.log("error occurred: ", result.errors[0]);
  } else {
    const randomResult = Array.isArray(result.response)
      ? result.response[0]
      : result.response;
    if (!randomResult) {
      return "";
    }
    return randomResult.urls.raw;
  }
};
