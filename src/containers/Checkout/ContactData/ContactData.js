import React, { Component } from 'react';
import axios from '../../../axios';

import { connect } from 'react-redux';

import Stylesheet from './ContactData.css';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorMessageHandler from '../../../hoc/ErrorMessageHandler/ErrorMessageHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidations } from '../../../helpers/utility';


class ContactData extends Component {
    state = {
        orderDataForm: {
            nombre: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Dinos tu nombre'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            direccion: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: '¿Donde vives?'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            postalcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Dinos el codigo postal del area donde vives'
                },
                value: '',
                validation: {
                    required: true,
                    min: 5,
                    max: 6
                },
                valid: false,
                touched: false
            },
            telefono: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: '¿Cual es tu numero telefonico?'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Tu direccion de correo electronido (prometemos no enviarte spam)'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            metodoEntrega: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'La mas rapida'},
                        {value: 'cheapest', displayValue: 'La mas economica'}
                    ]
                },
                value: 'cheapest',
                validation: {
                    required: false
                },
                valid: true,
                touched: false
            }
        },
        formIsValid: false
    }

    orderClickHandler = (ev) => {
        ev.preventDefault()

        const pedidoData = {
            ingredientes: this.props.ingredients.filter(i => i.count && i.count > 0),
            precio: this.props.price,
            cliente: {},
            userId: this.props.userId
        }

        for (let inputId in this.state.orderDataForm) {
            pedidoData.cliente[inputId] = this.state.orderDataForm[inputId].value
        }

        this.props.onOrderInit(pedidoData, this.props.token)
    }


    onInputChangedHandler = (event, inputId) => {
        const value = event.target.value
        const updatedInputElement = updateObject(this.state.orderDataForm[inputId], {
            value: value,
            valid: checkValidations(value, this.state.orderDataForm[inputId].validation),
            touched: true
        })
        const updatedOrderForm = updateObject(this.state.orderDataForm, {
            [inputId]: updatedInputElement
        })
        
        let formIsValid = true
        for (let inputId in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputId].valid && formIsValid
        }
        
        this.setState({orderDataForm: updatedOrderForm, formIsValid: formIsValid})
    }

    render() {
        let form = null, formInputs = null

        formInputs = Object.keys(this.state.orderDataForm).map(fi => 
            <Input 
                key={fi} 
                elementType={this.state.orderDataForm[fi].elementType} 
                elementConfig={this.state.orderDataForm[fi].elementConfig} 
                value={this.state.orderDataForm[fi].value}
                shouldValidate={this.state.orderDataForm[fi].validation}
                valid={this.state.orderDataForm[fi].valid}
                touched={this.state.orderDataForm[fi].touched}
                changed={(event) => this.onInputChangedHandler(event, fi)} />
        )

        if (this.props.loading) {
            form = <Spinner />
        } else if (this.props.purchaseSaved) {
            form = <p style={{textAlign: 'center'}}>¡El pedido ha sido enviado satisfactoriamente!</p>
            
        } else {
            form = (
                <form onSubmit={this.orderClickHandler}>
                    <legend>Enter your contact details</legend>
                    {formInputs}
                    <Button btnType='Success' btnClicked={this.orderClickHandler} disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
            )
            
        }
        return (
            <div className={Stylesheet.ContactData}>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        purchaseSaved: state.order.purchaseSaved,
        token: state.auth.idToken,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderInit: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorMessageHandler(ContactData, axios));