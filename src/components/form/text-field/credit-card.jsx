import {splitStringIntoChunks} from "../../../util"

import TextField from './index'

export default class CreditCardField extends TextField {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

    }

    onChange(value) {
        value = value.split('-').join('');

        if (isNaN(value)) {
            return;
        }

        super.onChange(value);
    }

    render() {
        return (
            <TextField {...this.props}
                onChange={this.onChange}
                maxLength={19}
                value={splitStringIntoChunks(this.props.value, 4).join('-')}/>
        );
    }
}