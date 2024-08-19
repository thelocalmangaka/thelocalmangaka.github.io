export function hasError(response) {
    return response!== null && response !== undefined
        && response.error !== null && response.error !== undefined
        && response.error.message !== null && response.error.message !== undefined;
}

export function getError(error) {
    let message = "Message from Facebook API: ";
    // error_user_msg returned by FB can often be more descriptive than message
    if (error.error_user_msg !== null && error.error_user_msg !== undefined) {
        message += error.error_user_msg;
    } else {
        message += error.message;
    }
    return message;
}

export function logError(error) {
    console.log(getError(error));
}

export function logErrorString(message) {
    console.log(message);
}

export function log(message) {
    console.log(message);
}

export function logJson(message) {
    console.log(message);
}