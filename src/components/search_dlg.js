/*
    AgentMPDFRB - modal dialog for entering search parameters
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
import PropTypes from 'prop-types';
import {Button, Form, Modal} from "react-bootstrap";

export class SearchDialog extends React.Component {
    constructor(props) {
        super(props);

        this.focusElement = null;

        this.state = {
            show_search_dialog: props.show,
            search_option: 0,
            search_text: "",
        };

        // this.loadPlayList = this.loadPlayList.bind(this);
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.onSearchOptionsChanged = this.onSearchOptionsChanged.bind(this);
        this.onExecuteSearch = this.onExecuteSearch.bind(this);
        this.onCancelSearch = this.onCancelSearch.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Put focus in search text control
        if (this.focusElement !== null) {
            this.focusElement.focus();
        }

        if (prevProps.show !== this.props.show) {
            this.setState({show_search_dialog: this.props.show});
        }
    }

    onSearchTextChanged(evt) {
        const v = evt.target.value;
        console.log("Search text: " + v);
        this.setState({search_text: v});
    }

    onSearchOptionsChanged(evt) {
        // Note that the value appears to be a string
        const v = parseInt(evt.target.value);
        console.log("Search option: " + v);
        this.setState({search_option: v});
    }

    onExecuteSearch(evt) {
        this.props.onExecuteSearch(this.state.search_text, this.state.search_option)
    }

    onCancelSearch(evt) {
        this.props.onCancelSearch();
    }

    render() {
        return (
             <Modal show={this.state.show_search_dialog} onHide={null}>
                <Modal.Header>
                    <Modal.Title>Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Enter search text
                    <Form>
                        <div className={"mb-3 form-group"}>
                            <Form.Control
                                className={"mb-3"}
                                onChange={this.onSearchTextChanged}
                                value={this.state.search_text}
                                ref={inputEl => (this.focusElement = inputEl)}
                            >
                            </Form.Control>
                            <Form.Check
                                className={"mb-3"}
                                type="radio"
                                id={"playlists"}
                                value={0}
                                checked={this.state.search_option === 0}
                                label={"All playlists containing the search text"}
                                onChange={this.onSearchOptionsChanged}
                                name={"searchoptions"}
                            >
                            </Form.Check>
                            <Form.Check
                                className={"mb-3"}
                                type="radio"
                                id={"albums"}
                                label={"All albums containing the search text"}
                                value={1}
                                checked={this.state.search_option === 1}
                                onChange={this.onSearchOptionsChanged}
                                name={"searchoptions"}
                            >
                            </Form.Check>
                            <Form.Check
                                className={"mb-3"}
                                type="radio"
                                id={"albums-by-artist"}
                                label={"All albums by an artist identified by the search text"}
                                value={2}
                                checked={this.state.search_option === 2}
                                onChange={this.onSearchOptionsChanged}
                                name={"searchoptions"}
                            >
                            </Form.Check>
                            <Form.Check
                                type="radio"
                                className={"mb-3"}
                                id={"tracks-songs"}
                                label={"All tracks/songs containing the search text"}
                                value={3}
                                checked={this.state.search_option === 3}
                                onChange={this.onSearchOptionsChanged}
                                name={"searchoptions"}
                            >
                            </Form.Check>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={"d-flex justify-content-center"}>
                    <Button
                        variant="primary"
                        onClick={this.onExecuteSearch}
                        disabled={this.state.search_text.length <= 0}
                    >
                        Search
                    </Button>
                    <Button variant="warning" onClick={this.onCancelSearch}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

SearchDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    onExecuteSearch: PropTypes.func.isRequired,
    onCancelSearch: PropTypes.func.isRequired
};

SearchDialog.defaultProps = {
    show: false,
};
