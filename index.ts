import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("my-bucket", {
    location: "US",
    uniformBucketLevelAccess: true,
    publicAccessPrevention: "inherited"
});

// Put something in the bucket
const bucketObject = new gcp.storage.BucketObject("index.html", {
    bucket: bucket.name,
    source: new pulumi.asset.FileAsset("index.html")
});

// This approach didn't work with the same error, initial searchings say that there's a different thing called domain restricted sharing which might be at play. It's unclear to me what that is.
const bucketPolicyData = gcp.organizations.getIAMPolicy({
    bindings: [{
        role: "roles/storage.objectViewer",
        members: ["allUsers"]
    }],
})

const bucketPolicy = new gcp.storage.BucketIAMPolicy("policy", {
    bucket: bucket.name,
    policyData: bucketPolicyData.then(bucketPolicyData => bucketPolicyData.policyData),
});
//Set policy on the bucket, it's a binding?
//const bucketBinding = new gcp.storage.BucketIAMBinding("my-bucket-binding", {
//    bucket: bucket.name,
//    role: "roles/storage.objectViewer",
//    members: ["allUsers"]
//});

// Export the DNS name of the bucket
export const bucketName = bucket.url;
