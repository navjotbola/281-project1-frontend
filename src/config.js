export default {
    MAX_ATTACHMENT_SIZE: 10000000,
    s3: {
        REGION: "us-east-2",
        BUCKET: "project1-file-uploads"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://9qpn59n1ml.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_ITEfbe8rH",
        APP_CLIENT_ID: "6cbise2amhpfo8quk4kerd58jr",
        IDENTITY_POOL_ID: "us-east-2:3a70c8de-2f2f-4111-9167-7159153cfb6a"
    }
};