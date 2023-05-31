export const renderUrlImageS3 = (filePath) => {
  const bucket = process.env.MIX_AWS_S3_BUCKET;
  const region = process.env.MIX_AWS_S3_REGION;
  // window.location.origin is https://domain
  
  return bucket
    ? `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`
    : `${window.location.origin}/${filePath}`;
}
