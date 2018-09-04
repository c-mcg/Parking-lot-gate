import TextField from './index'

export default class PasswordField extends TextField {

    render() {
        return (
            <TextField {...this.props} type="password"/>
        );
    }

}