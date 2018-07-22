import React, { Component } from 'react'

import {EurekaForm} from 'react-eureka'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import logo from './img/seja-ninja.svg'

const questions = [
  {key: 'name', title: 'Como você se chama? '},
  {key: 'email', title: 'Qual seu email?'},
  {key: 'tel', title: 'Qual seu telefone? '},
  {key: 'city', title: 'Qual cidade, estado, país você mora?'},
  {key: 'profesion', title: 'O que você faz da vida?'},
  {key: 'motivation', title: 'Pq vc quer ser NINJA?'},
  {key: 'skills', title: 'Com o que você colaboraria?'},
  {key: 'instagram', title: 'Compartilhe seu instagram'}
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
  <EurekaForm id='contact' questions={questions} autoFocus
    onSubmit={next}
  />
)

const SendData = ({next, args}) => {
  const { name, city, area, email, phone } = args[1]

  return (
    <h1>VALEU <em>{name}</em> de <em>{city}</em>, te anotamos en nuestra lista de <em>{area}</em></h1>
  )
}

const Details = () => (
    <div className="flex">
        <h1>Preencha seus dados para que possamos te conhecer
            melhor e entrar em contato</h1>
    <Stepper>
      <FormWrapper />
      <SendData />
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
