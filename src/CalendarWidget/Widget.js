import React, {useState, useEffect} from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

function Widget() {
    const [events, setEvents] = useState([]);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const start = () => {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          });
        };
        gapi.load('client:auth2', start);
      }, []);
    }