import TextField from './index'

export default class NumberField extends TextField {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {

        if (isNaN(value)) {
            return;
        }

        this.props.onChange && this.props.onChange(value);
    }

    render() {
        return (
            <TextField {...this.props} onChange={this.onChange}/>
        );
    }
}