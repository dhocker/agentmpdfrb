/*
    AgentMPDFRB - main navbar
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
import { Nav, Navbar, NavItem, NavbarBrand } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export class MainNavBar extends React.Component {
    render() {
        return (
            <Navbar className="navbar navbar-expand-lg navbar-light bg-light" role="navigation">
                <Nav className="navbar-nav mr-auto">
                    <LinkContainer to="/" className="nav-link">
                        <NavItem className="nav-item">Player</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/editplaylist" className="nav-link">
                        <NavItem className="nav-item">Edit Playlist</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/settingsform" className="nav-link">
                        <NavItem className="nav-item">Settings</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/about" className="nav-link">
                        <NavItem className="nav-item">About</NavItem>
                    </LinkContainer>
                </Nav>
                <NavbarBrand className="position-absolute end-0">
                    <span className="text-primary me-2">AgentMPD Flask/React/Bootstrap-5</span>
                    <img src="static/app.png" className="ms-2 mr-0" width="30" height="30" alt="Logo" />
                </NavbarBrand>
            </Navbar>
        );
    }
};
