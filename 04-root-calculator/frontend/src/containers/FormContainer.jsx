import React from "react";
import axios from 'axios';

class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            number: null,
            degree: null,
            result: ''
        };
    }

    handleClick = (event) => {
        const data = {
            number: this.state.number,
            degree: this.state.degree
        };

        axios.post('/api/root/', data).then(response => {
            this.setState({
                result: response.data
            });
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <div>
                <label htmlFor="firstNumber">
                    <span>Number <span class="required">*</span></span>
                    <input 
                        type="number" 
                        class="input-field" 
                        id="number" 
                        name="number" 
                        value={this.state.number} 
                        onChange={e => this.setState({ number: e.target.value })}/>
                </label>
                <label htmlFor="secondNumber">
                    <span>Degree of root <span class="required">*</span></span>
                    <input 
                        type="number" 
                        class="input-field" 
                        id="degree" 
                        name="degree" 
                        value={this.state.degree} 
                        onChange={e => this.setState({ degree: e.target.value })}/>
                </label>
                <div>{this.state.result}</div>
                <br/>
                <label><span> </span>
                <input 
                    type="submit" 
                    value="Submit"
                    onClick={this.handleClick}
                    class="btn btn-primary"
                    disabled={!this.state.number || !this.state.degree} />
                </label>
            </div>
        );
    }
}


export default FormContainer;