/*
  Markdown to HTML to JSX React Component
  © 2020, 2022 Dave Hocker (AtHomeX10@gmail.com)

  Takes markdown formatted text and renders it using GitHub flavored
  markdown styling.

  Usage
    <Markdown text="markdown text..."/>

  References
    Markdown to HTML: https://github.com/showdownjs/showdown
    HTML to JSX: https://github.com/wrakky/react-html-parser
    GitHub flavored styling: https://github.com/sindresorhus/github-markdown-css
*/

import React from "react";
import showdown from 'showdown';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from "prop-types";

// This stylesheet produces GitHub-like output
import "github-markdown-css/github-markdown.css";
import "./markdown.scss";

export class Markdown extends React.Component {
    constructor(props) {
        super(props);

        // This is an example of rendering Markdown to HTML
        // and then converting the HTML to JSX.
        this.converter = new showdown.Converter();
        this.converter.setFlavor('github');
        // See https://github.com/showdownjs/showdown for more on these options
        this.converter.setOption("tables", true);
        // We don't want a line break for every newline in the Markdown file
        this.converter.setOption("simpleLineBreaks", false);

        this.state = {
            html: this.converter.makeHtml(props.text)
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If the text has changed, re-render from Markdown to HTML
        if (prevProps.text !== this.props.text) {
            this.setState({
                html: this.converter.makeHtml(this.props.text)
            });
        }
    }

    render() {
        return (
            <div className="markdown-body">
                {ReactHtmlParser(this.state.html)}
            </div>
        )
    }
}

Markdown.propTypes = {
    text: PropTypes.string
};

Markdown.defaultProps = {
    text: "Loading..."
};
