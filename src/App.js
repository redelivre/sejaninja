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

const Details = () => (
    <div className="flex">
        <h1>Preencha seus dados para que possamos te conhecer
            melhor e entrar em contato</h1>
        <EurekaForm id="contact" questions={questions} autoFocus={true} />
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
