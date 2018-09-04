import React from 'react';
import PropTypes from 'prop-types';

import uniqid from 'uniqid'

import {componentInstanceOf} from '../../util'

import TextField from './text-field'
import Button from './button'

export default class Form extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            values: {}
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit && this.props.onSubmit(this.state.values);
    }

    componentDidMount() {
        this.setState(
            this.props.children.reduce((state, child) => {
                if (componentInstanceOf(child, TextField) && child.props.name) {
                    state[child.props.name] = "";
                }
                return state;
            }, {})
        )
    }

    onValueChanged(name, value) {
        let values = Object.assign({}, this.state.values);
        values[name] = value;
        this.setState({values})
    }

    getInjectedChildren() {
        let textFields = [];

        let submitButton = null;
        let submitButtonId = null

        let newChildren = React.Children.map(this.props.children, (child) => {
            if (child === null) {
                return null;
            }

            let overrideProps = {}

            if (componentInstanceOf(child, TextField)) {
                if (!child.props.name && !child.props.onChange) {
                    console.warn('Text field should have either `name` or `onChange` prop set');
                    return child;
                }

                const childName = child.props.name;
                overrideProps.onChange = (value) => {
                    this.onValueChanged(childName, value);
                }
                overrideProps.value = this.state.values[childName];
                
            } else if (!componentInstanceOf(child, Button)) {
                return child;
            }

            return React.cloneElement(child, Object.assign({}, child.props, overrideProps))
        })

        return newChildren;
    }

    render() {
        return <form action="#" onSubmit={this.onSubmit} method="POST">
            {this.getInjectedChildren()}
        </form>
    }
}

Form.propTypes = {
    onSubmit: PropTypes.func
}

Form.defaultProps = {
    onSubmit: null
}