const dev = {
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
    },
    social: {
        facebook: "2292140521006822",
    }
};

const prod = {
    s3: {
        REGION: "us-east-2",
        BUCKET: "locker-app-api-prod-lockeruploadsbucket-ptns8j7ctgdq"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://zyr6xrdhoh.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_Iew1gDcaq",
        APP_CLIENT_ID: "14uak6gp9jtp049n1dv8k9m3pq",
        IDENTITY_POOL_ID: "us-east-2:6f4547a9-2e80-4ada-b8c0-df4971540210"
    },
    social: {
        facebook: "175637390039621",
    }
};

console.log(process.env);

const config = process.env.REACT_APP_ENV_PIPELINE_STAGE === 'prod' ? prod : dev;

export default {
    MAX_ATTACHMENT_SIZE: 10000000,
    ...config
};