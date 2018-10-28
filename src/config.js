// export default {
//     MAX_ATTACHMENT_SIZE: 10000000,
//     s3: {
//         REGION: "us-east-2",
//         BUCKET: "project1-file-uploads"
//     },
//     apiGateway: {
//         REGION: "us-east-2",
//         URL: "https://9qpn59n1ml.execute-api.us-east-2.amazonaws.com/prod"
//     },
//     cognito: {
//         REGION: "us-east-2",
//         USER_POOL_ID: "us-east-2_ITEfbe8rH",
//         APP_CLIENT_ID: "6cbise2amhpfo8quk4kerd58jr",
//         IDENTITY_POOL_ID: "us-east-2:3a70c8de-2f2f-4111-9167-7159153cfb6a"
//     }
// };

export default {
    MAX_ATTACHMENT_SIZE: 10000000,
    s3: {
        REGION: "us-east-2",
        BUCKET: "locker-app-api-dev-lockeruploadsbucket-1nkc0v0gdyvoj"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://zrrc641yw7.execute-api.us-east-2.amazonaws.com/dev"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_Mny6kOWfQ",
        APP_CLIENT_ID: "1gko19ejd4kg43iuqei1clc4dc",
        IDENTITY_POOL_ID: "us-east-2:91d5da45-de31-4b18-bd5a-4828ea6e7028"
    }
};