const azure = require("azure-storage");

const blobService = azure.createBlobService(
  "DefaultEndpointsProtocol=https;AccountName=tanzeelat;AccountKey=eVvNpa8LZFkvFuB2bDmUtfIp3+drGG9U6JOoPp2/LIEv7Mq74/VKRsJAX+pCcyB9kHv5fLm47+z4aTT0ytZrHw==;EndpointSuffix=core.windows.net"
);

export const azureUpload = async (
  filename: any,
  fileStream: any,
  streamSize: any,
  container: string
) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromStream(
      container,
      filename,
      fileStream,
      streamSize,
      (error: any, response: any) => {
        if (!error) {
          resolve(
            `https://tanzeelat.blob.core.windows.net/${container}/${response?.name}`
          );
        } else reject(error);
      }
    );
  });
};

export const azureUploadfromFile = async (
  filename: any,
  filePath: any,
  container: string
) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(
      container,
      filename,
      filePath,
      {},
      (error: any, response: any) => {
        if (!error) {
          resolve(
            `https://tanzeelat.blob.core.windows.net/${container}/${response?.name}`
          );
        } else reject(error);
      }
    );
  });
};

export const deleteFile = (container: string, file: string) => {
  const blob = file.split("/").pop();
  blobService.deleteBlobIfExists(
    container,
    blob,
    (error: any, response: any) => {
      if (!error) {
        console.log("Deleted file: ");
        console.log(response);
      } else console.log("Deletion failed");
    }
  );
};
