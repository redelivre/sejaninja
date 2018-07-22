import React, { Component } from 'react'

import {EurekaForm} from 'react-eureka'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import logo from './img/seja-ninja.svg'

const questions = [
    {title: 'Cual e seu nome ?'},
    {title: 'Onde mora ?'},
    {title: 'En que area quer ajudar ?'},
    {title: 'Cual e seu email ?'},
    {title: 'Cuel e seu fone ?'}
]


class Stepper extends React.PureComponent {
    constructor () {
        super()
        this.state = {
            step: 0
        }
    }

    render () {
        const {children} = this.props
        const {step} = this.state

        const clonedChild = React.Children.map(
            children, (child, i) => i === step ? React.cloneElement(child, {
                next: () => (this.setState({step: step + 1}))
            }): null).filter(a => a)

        return (
            <div>
                {clonedChild}
            </div>
        )
    }
}

const FormWrapper = ({next, ...props}) => (
    <EurekaForm id="contact" questions={questions} autoFocus={true}
                onSubmit={next}
    />)

const Details = () => (
    <div className="flex">
        <h1>Preencha seus dados para que possamos te conhecer
            melhor e entrar em contato</h1>
        <Stepper>
            <FormWrapper />
            <h1>VALEU</h1>
        </Stepper>
    </div>
)

class App extends Component {
    render () {
        return (

            <div className='App'>
                <div id="hero">
                    <img src={logo}/>
                    <Details/>
                </div>

            </div>)
    }
}

export default App
