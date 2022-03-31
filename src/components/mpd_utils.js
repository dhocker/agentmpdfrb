/*
    AgentMPDFRB - MPD related common functions
    Copyright © 2022  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

// MPD state enumeration
export const STATE_STOPPED = 0;
export const STATE_PAUSED = 1;
export const STATE_PLAYING = 2;
export const STATE_UNKNOWN = -1;

// Decode a text transport state into a numeric state
export function decodeTransportState(mpd_state) {
    let state = STATE_STOPPED;
    switch (mpd_state) {
        case "play":
            state = STATE_PLAYING;
            break;
        case "stop":
            state = STATE_STOPPED;
            break;
        case "pause":
            state = STATE_PAUSED;
            break;
        default:
            state = STATE_STOPPED;
            break;
    };

    return state;
}

// Translate transport state into a human readable string
export function transportStateAsString(enum_state) {
    let state = "undefined";
    switch (enum_state) {
        case STATE_STOPPED:
            state = "stopped";
            break;
        case STATE_PLAYING:
            state = "playing";
            break;
        case STATE_PAUSED:
            state = "paused";
            break;
        case STATE_UNKNOWN:
            state = "unknown";
            break;
        default:
            state = "undefined";
            break;
    }

    return state;
}