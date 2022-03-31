/*
    AgentMPDFRB - template for developing a React component
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

import React from 'react';
// import PropTypes from 'prop-types';

export class TemplateComponent extends React.Component {
    constructor(props) {
        super(props);

        // this.messageTimer = null
        // this.reload_playlist = props.reload;

        // Initial state with empty rows
        this.state = {
        };

        // this.loadPlayList = this.loadPlayList.bind(this);
    }

    // Component is mounted
    componentDidMount() {
        // this.loadPlayList();
    }

    // Component will unmount
    componentWillUnmount() {
        // if (this.messageTimer !== null) {
        //     clearInterval(this.messageTimer);
        //     this.messageTimer = null;
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.reload_playlist !== this.props.reload) {
        //     this.loadPlayList();
        //     this.reload_playlist = this.props.reload;
        //     console.log("Editable playlist did update");
        // }
    }

    render() {
        return (
            <>
            </>
        );
    }
}

TemplateComponent.propTypes = {
};

TemplateComponent.defaultProps = {
};
