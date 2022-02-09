export default class ApiMessage {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    toJson(): object {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: this.message,
            }),
        };
    }

    static successJson(): object {
        return new ApiMessage(`Success`).toJson();
    }
}
