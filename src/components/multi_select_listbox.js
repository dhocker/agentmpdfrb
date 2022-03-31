/*
    AgentMPDFRB - a multi-select listbox component
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
import {Form} from "react-bootstrap";
import PropTypes from 'prop-types';
import {updateSelectedExample} from "react-html-parser/demo/src/js/actions";

// MultiSelectListBox(rows, controlId, name, label, onSelect)
export class MultiSelectListbox extends React.Component {
    constructor(props) {
        super(props);

        // this.messageTimer = null
        // this.reload_playlist = props.reload;
        this.selectRef = null;

        // Initial state with empty rows
        this.state = {
            selected_values: [],
        };

        this.onSelectionChange = this.onSelectionChange.bind(this);
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
        if (prevProps.rows !== this.props.rows) {
            this.setState({values: []});
        }
    }

    onSelectionChange(evt) {
        // Capture selected rows and send them upstream
        let selected_rows = [];
        let selected_values = [];
        for (let i = 0; i < evt.target.selectedOptions.length; i++) {
            const selected_row_index = evt.target.selectedOptions[i].value;
            selected_rows.push(this.props.rows[selected_row_index])
            selected_values.push(selected_row_index);
        }

        this.setState({selected_values: selected_values});
        this.props.onSelectionChanged(selected_rows);
    }

    render() {
        // MultiSelectListBox(rows, controlId, name, label, onSelect)
        const $this = this;
        let keyval = -1;
        // Render rows as option statements
        const renderedRows = $this.props.rows.map(function (row) {
            // handle the column data within each row
            keyval += 1;
            // Determine the row title. If there is no title key the title IS the row.
            let title = row;
            if ($this.props.title_key !== "") {
                title = row[$this.props.title_key];
            }
            return (
                <option key={keyval} value={keyval}>{title}</option>
            );
        });

        // There are issues with the "multiple" property
        return (
            <Form.Group>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control
                    id={$this.props.controlId}
                    name={$this.props.name}
                    as="select"
                    defaultValue={[]}
                    onChange={$this.onSelectionChange}
                    style={{height: $this.props.height}}
                    multiple
                    value={this.state.selected_values}
                >
                    {renderedRows}
                </Form.Control>
            </Form.Group>
        );
    }
}

MultiSelectListbox.propTypes = {
    rows: PropTypes.array.isRequired,
    controlId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSelectionChanged: PropTypes.func.isRequired,
    height: PropTypes.string,
    title_key: PropTypes.string,
};

MultiSelectListbox.defaultProps = {
    title_key: "",
    height: '250px',
};
