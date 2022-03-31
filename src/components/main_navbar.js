/*
  React, ReactRouter, Bootstrap 4
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
