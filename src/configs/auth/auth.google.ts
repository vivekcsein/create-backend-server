
import * as arctic from "arctic";
import { envGoogleClient } from "../constants/config.env";

const clientId = envGoogleClient.GOOGLE_CLIENT_ID;
const clientSecret = envGoogleClient.GOOGLE_CLIENT_SECRET;
const redirectURI = envGoogleClient.GOOGLE_REDIRECT_URL;

export const google = new arctic.Google(clientId, clientSecret, redirectURI);