
import React from 'react';
import { ajaxGet } from "./ajax_utils";

export class BasePlayList extends React.Component {
    static SORT_ASC = 1;
    static SORT_INVERT = -1;

    constructor(props) {
        super(props);

        this.loadPlayList = this.loadPlayList.bind(this);
    }

    // Get the current playlist
    async getPlayList() {
        const data = await ajaxGet('/cpl/currentplaylist');
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a playlist property.
            // Eventually, we hope to introduce the notion of a playlist name.
            return data.playlist;
        } else {
            const error = "getPlayList failed"
            console.error('AJAX error', error);
        }

        return null;
    }

    // t is in seconds (e.g. 300 = 00:05:00)
    formatTime(t) {
        const tt = parseInt(String(t).replace(":", "."));

        let hh_part = "";
        let hh = parseInt(tt / 3600);
        if (hh > 0) {
            hh_part = String(hh) + ":";
        }

        const mm = parseInt((tt - (hh * 3600)) / 60);
        let mm_part = String(mm) + ":";
        if (hh_part.length > 0 && mm < 10) {
            mm_part = "0" + mm_part;
        }

        const ss = parseInt(tt % 60);
        let ss_part = String(ss);
        if (ss < 10) {
            ss_part = "0" + ss_part;
        }

        return hh_part + mm_part + ss_part;
    }
}

BasePlayList.defaultProps = {
}
