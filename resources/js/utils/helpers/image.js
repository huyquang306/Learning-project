export const renderUrlImageS3 = (filePath) => {
  const bucket = process.env.MIX_AWS_S3_BUCKET;
  // window.location.origin is https://domain
  
  return bucket
    ? `https://${bucket}/${filePath}`
    : `${window.location.origin}/${filePath}`;
}
