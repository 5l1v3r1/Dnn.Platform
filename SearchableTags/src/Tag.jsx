import React, { Component, PropTypes } from "react";

export default class Tag extends Component {

    render() {
        return (
            <div className="tag glyph">
                {this.props.tag}
                <span className="close" onClick={this.props.onRemove}>×</span>
            </div>
        );
    }
}

Tag.propTypes = {
    tag: PropTypes.string,
    onRemove: PropTypes.func
};